import Command, { flags } from '@oclif/command';
import { OutputArgs, OutputFlags } from '@oclif/parser';
import { logger } from './utils/logger';
import { config } from './utils/config';

export abstract class BaseCommand extends Command {
  public static flags = {
    help: flags.help({
      char: 'h',
      description: 'display usage information',
    }),
    version: flags.version({
      char: 'v',
      description: 'display version information',
    }),
  };

  protected args: OutputArgs<any>;
  protected flags: OutputFlags<any>;

  protected abstract execute(): Promise<void>;

  protected async init(): Promise<void> {
    super.init();

    const data = this.parse(this.constructor as any);

    this.args = data.args;
    this.flags = data.flags;
  }

  public async run(): Promise<void> {
    if (this.constructor.name !== 'InitCommand' && !config.fileExists()) {
      logger.error("You're not in a QuantConnect CLI project.");
      logger.error("You can create one by running 'qcli init' in an empty directory.");
    }

    try {
      await this.execute();
    } catch (err) {
      if (err.code !== 'EEXIT') {
        logger.error(err.message);
      }

      process.exit(1);
    }
  }
}
