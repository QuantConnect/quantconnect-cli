import { flags } from '@oclif/command';
import { BaseCommand } from '../../BaseCommand';
import { compileProject } from '../../utils/api';
import {
  generateBacktestName,
  getBacktestUrl,
  isBacktestComplete,
  logBacktestInformation,
} from '../../utils/backtests';
import { logger } from '../../utils/logger';
import { poll, terminateProgressBar } from '../../utils/promises';

export default class NewBacktestCommand extends BaseCommand {
  public static description = 'launch a backtest for a project';

  public static flags = {
    ...BaseCommand.flags,
    ...BaseCommand.createProjectFlag(),
    name: flags.string({
      char: 'n',
      description: 'name of the backtest (optional, a random one is generated if not specified)',
    }),
    open: flags.boolean({
      char: 'o',
      description: 'open the backtest results in the browser when done',
      default: false,
    }),
  };

  private currentProject: QCProject = null;
  private runningBacktest: QCBacktest = null;

  protected async execute(): Promise<void> {
    const project = await this.parseProjectFlag();

    const compile = await compileProject(this.api, project);

    const backtest = await this.api.backtests.create(
      project.projectId,
      compile.compileId,
      this.flags.name || generateBacktestName(),
    );

    this.currentProject = project;
    this.runningBacktest = backtest;

    logger.info(`Started backtest named '${backtest.name}' for project '${project.name}'`);

    if (!isBacktestComplete(backtest)) {
      logger.info(`Backtest url: ${getBacktestUrl(project, backtest)}`);
    }

    const finishedBacktest = await poll({
      makeRequest: () => this.api.backtests.get(project.projectId, backtest.backtestId),
      isDone: data => isBacktestComplete(data),
      getProgress: data => data.progress,
    });

    this.runningBacktest = null;

    await logBacktestInformation(project, finishedBacktest, this.flags.open);

    if (finishedBacktest.error !== null) {
      process.exit(1);
    }
  }

  protected async onInterrupt(): Promise<void> {
    if (this.isBacktestRunning()) {
      const confirmation = await logger.askBoolean('Do you want to cancel and delete the running backtest?', true);
      if (confirmation) {
        if (this.isBacktestRunning()) {
          await this.api.backtests.delete(this.currentProject.projectId, this.runningBacktest.backtestId);
          logger.info(`Successfully cancelled and deleted backtest '${this.runningBacktest.name}'`);
        } else {
          logger.info('Backtest already finished, cancel aborted');
        }
      }
    }

    return super.onInterrupt();
  }

  private isBacktestRunning(): boolean {
    return this.runningBacktest !== null && !isBacktestComplete(this.runningBacktest);
  }
}
