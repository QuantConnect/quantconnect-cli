import { BaseCommand } from '../../BaseCommand';

export default class PullCommand extends BaseCommand {
  public static description =
    'pull all files from QuantConnect to the current directory';

  public static flags = {
    ...BaseCommand.flags,
  };

  public async run(): Promise<void> {
    // TODO(jmerle): Implement
  }
}
