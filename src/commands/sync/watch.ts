import { BaseCommand } from '../../BaseCommand';

export default class WatchCommand extends BaseCommand {
  public static description =
    'watch for local file changes and push them to QuantConnect';

  public static flags = {
    ...BaseCommand.flags,
  };

  public async run(): Promise<void> {
    // TODO(jmerle): Implement
  }
}
