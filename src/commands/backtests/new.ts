import { BaseCommand } from '../../BaseCommand';

export default class RunBacktestCommand extends BaseCommand {
  public static description = 'run a backtest for a project';

  public static flags = {
    ...BaseCommand.flags,
  };

  public async run(): Promise<void> {
    // TODO(jmerle): Implement
  }
}
