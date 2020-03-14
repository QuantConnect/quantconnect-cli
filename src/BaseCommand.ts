import Command, { flags } from '@oclif/command';
import { OutputArgs, OutputFlags } from '@oclif/parser';

export abstract class BaseCommand extends Command {
  public static flags = {
    help: flags.help({ char: 'h' }),
  };

  protected args: OutputArgs<any>;
  protected flags: OutputFlags<any>;

  protected async init(): Promise<void> {
    super.init();

    const data = this.parse(this.constructor as any);

    this.args = data.args;
    this.flags = data.flags;
  }
}
