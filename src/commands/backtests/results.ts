import { BaseCommand } from '../../BaseCommand';

export default class ShowBacktestResultsCommand extends BaseCommand {
  public static description = 'show the results of a given backtest';

  public static flags = {
    ...BaseCommand.flags,
  };

  public async run(): Promise<void> {
    // TODO(jmerle): Implement
  }
}
