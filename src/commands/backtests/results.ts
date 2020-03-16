import { flags } from '@oclif/command';
import { BaseCommand } from '../../BaseCommand';
import { logBacktestInformation } from '../../utils/backtests';

export default class ShowBacktestResultsCommand extends BaseCommand {
  public static description = 'show the results of a given backtest';

  public static flags = {
    ...BaseCommand.flags,
    ...BaseCommand.createProjectFlag(),
    ...BaseCommand.createBacktestFlag(),
    open: flags.boolean({
      char: 'o',
      description: 'open the backtest results in the browser',
      default: false,
    }),
  };

  protected async execute(): Promise<void> {
    const project = await this.parseProjectFlag();
    const backtest = await this.parseBacktestFlag(project.projectId);

    const fullBacktest = await this.api.backtests.get(project.projectId, backtest.backtestId);

    await logBacktestInformation(project, fullBacktest, this.flags.open);
  }
}
