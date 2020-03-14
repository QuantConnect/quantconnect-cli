import { BaseCommand } from '../BaseCommand';

export default class InitCommand extends BaseCommand {
  public static description = 'create a new QuantConnect CLI project';

  public static flags = {
    ...BaseCommand.flags,
  };

  public async run(): Promise<void> {
    // TODO(jmerle): Implement
  }
}
