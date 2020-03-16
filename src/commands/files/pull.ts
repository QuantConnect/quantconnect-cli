import { flags } from '@oclif/command';
import { BaseCommand } from '../../BaseCommand';

export default class PullCommand extends BaseCommand {
  public static description = 'pull all files from QuantConnect to the current directory';

  public static flags = {
    ...BaseCommand.flags,
    overwrite: flags.boolean({
      char: 'o',
      description: 'overwrite local files even if local version is newer',
      default: false,
    }),
  };

  protected async execute(): Promise<void> {
    // TODO(jmerle): Implement
  }
}
