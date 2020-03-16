import { BaseCommand } from '../../BaseCommand';

export default class PullCommand extends BaseCommand {
  public static description = 'pull all files from QuantConnect to the current directory';

  public static flags = {
    ...BaseCommand.flags,
  };

  protected async execute(): Promise<void> {
    // TODO(jmerle): Implement
  }
}
