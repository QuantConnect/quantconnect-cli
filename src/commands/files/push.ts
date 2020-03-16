import { flags } from '@oclif/command';
import { BaseCommand } from '../../BaseCommand';

export default class PushCommand extends BaseCommand {
  public static description = 'push locally updated files to QuantConnect';

  public static flags = {
    ...BaseCommand.flags,
    overwrite: flags.boolean({
      char: 'o',
      description: 'overwrite remote files even if remote version is newer',
      default: false,
    }),
    watch: flags.boolean({
      char: 'w',
      description: 'watch for local file changes and push them to QuantConnect after initial push',
      default: false,
    }),
  };

  protected async execute(): Promise<void> {
    // TODO(jmerle): Implement
  }
}
