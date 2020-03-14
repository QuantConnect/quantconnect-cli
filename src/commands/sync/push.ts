import { BaseCommand } from '../../BaseCommand';

export default class PushCommand extends BaseCommand {
  public static description = 'push locally updated files to QuantConnect';

  public static flags = {
    ...BaseCommand.flags,
  };

  public async run(): Promise<void> {
    // TODO(jmerle): Implement
  }
}
