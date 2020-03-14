import { BaseCommand } from '../../BaseCommand';

export default class CompileProjectCommand extends BaseCommand {
  public static description = 'compile a project';

  public static flags = {
    ...BaseCommand.flags,
  };

  public async run(): Promise<void> {
    // TODO(jmerle): Implement
  }
}
