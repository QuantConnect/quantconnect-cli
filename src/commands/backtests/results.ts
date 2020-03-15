import { BaseCommand } from '../../BaseCommand';

export default class ShowBacktestResultsCommand extends BaseCommand {
  public static description = 'show the results of a given backtest';

  public static flags = {
    ...BaseCommand.flags,
  };

  protected async execute(): Promise<void> {
    // TODO(jmerle): Implement
  }
}
