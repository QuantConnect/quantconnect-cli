import { flags } from '@oclif/command';
import { BaseCommand } from '../../BaseCommand';
import { createBacktestFlag, createProjectFlag, parseBacktestFlag, parseProjectFlag } from '../../utils/command';
import { APIClient } from '../../api/APIClient';
import { logBacktestInformation } from '../../utils/backtests';

export default class ShowBacktestResultsCommand extends BaseCommand {
  public static description = 'show the results of a given backtest';

  public static flags = {
    ...BaseCommand.flags,
    ...createProjectFlag(),
    ...createBacktestFlag(),
    open: flags.boolean({
      char: 'o',
      description: 'open the backtest results in the browser',
    }),
  };

  protected async execute(): Promise<void> {
    const project = await parseProjectFlag(this.flags);
    const backtest = await parseBacktestFlag(project.projectId, this.flags);

    const api = new APIClient();
    const fullBacktest = await api.backtests.get(project.projectId, backtest.backtestId);

    await logBacktestInformation(project, fullBacktest, this.flags.open === true);
  }
}
