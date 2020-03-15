import { flags } from '@oclif/command';
import { BaseCommand } from '../../BaseCommand';
import { createProjectFlag, parseProjectFlag } from '../../utils/command';
import { APIClient } from '../../api/APIClient';
import { compileProject } from '../../utils/api';
import { logger } from '../../utils/logger';
import { generateBacktestName, logBacktestInformation } from '../../utils/backtests';

export default class RunBacktestCommand extends BaseCommand {
  public static description = 'run a backtest for a project';

  public static flags = {
    ...BaseCommand.flags,
    ...createProjectFlag(),
    name: flags.string({
      char: 'n',
      description: 'name of the backtest (optional, a random one is generated if not specified)',
    }),
    open: flags.boolean({
      char: 'o',
      description: 'open the backtest results in the browser',
    }),
  };

  protected async execute(): Promise<void> {
    const project = await parseProjectFlag(this.flags);

    const compile = await compileProject(project);

    const api = new APIClient();
    let backtest = await api.backtests.create(
      project.projectId,
      compile.compileId,
      this.flags.name || generateBacktestName(),
    );

    logger.info(`Started backtest named '${backtest.name}' for project '${project.name}'`);

    while (true) {
      backtest = await api.backtests.get(project.projectId, backtest.backtestId);

      if (backtest.completed) {
        break;
      }

      await new Promise(resolve => setTimeout(resolve, 250));
    }

    await logBacktestInformation(project, backtest, this.flags.open === true);

    if (backtest.error !== null) {
      process.exit(1);
    }
  }
}
