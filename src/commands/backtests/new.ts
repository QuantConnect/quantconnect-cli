import { flags } from '@oclif/command';
import { BaseCommand } from '../../BaseCommand';
import { compileProject } from '../../utils/api';
import { generateBacktestName, getBacktestUrl, logBacktestInformation } from '../../utils/backtests';
import { logger } from '../../utils/logger';
import { sleep } from '../../utils/promises';

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

  protected async execute(): Promise<void> {
    const project = await this.parseProjectFlag();

    const compile = await compileProject(this.api, project);

    let backtest = await this.api.backtests.create(
      project.projectId,
      compile.compileId,
      this.flags.name || generateBacktestName(),
    );

    logger.info(`Started backtest named '${backtest.name}' for project '${project.name}'`);

    if (!backtest.completed) {
      logger.info(`Backtest url: ${getBacktestUrl(project, backtest)}`);
    }

    while (!backtest.completed) {
      backtest = await this.api.backtests.get(project.projectId, backtest.backtestId);

      if (backtest.completed) {
        break;
      }

      await sleep(250);
    }

    await logBacktestInformation(project, backtest, this.flags.open);

    if (backtest.error !== null) {
      process.exit(1);
    }
  }
}
