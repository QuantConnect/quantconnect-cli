import { BaseCommand } from '../../BaseCommand';

export default class CompileProjectCommand extends BaseCommand {
  public static description = 'compile a project';

  public static flags = {
    ...BaseCommand.flags,
  };

  protected async execute(): Promise<void> {
    // TODO(jmerle): Implement
  }
}
