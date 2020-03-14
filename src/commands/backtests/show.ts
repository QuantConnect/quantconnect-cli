import { BaseCommand } from '../../BaseCommand';

export default class ShowBacktestCommand extends BaseCommand {
  public static description = 'show results of a given backtest';

  public static flags = {
    ...BaseCommand.flags,
  };

  public async run(): Promise<void> {
    // TODO(jmerle): Implement
  }
}
