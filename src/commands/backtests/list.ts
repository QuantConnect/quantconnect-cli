import { BaseCommand } from '../../BaseCommand';

export default class ListBacktestsCommand extends BaseCommand {
  public static description = 'list all backtest ran for a project';

  public static flags = {
    ...BaseCommand.flags,
  };

  public async run(): Promise<void> {
    // TODO(jmerle): Implement
  }
}
