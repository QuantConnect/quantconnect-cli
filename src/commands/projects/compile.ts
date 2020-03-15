import { BaseCommand } from '../../BaseCommand';
import { createProjectFlag, parseProjectFlag } from '../../utils/command';

export default class CompileProjectCommand extends BaseCommand {
  public static description = 'compile a project';

  public static flags = {
    ...BaseCommand.flags,
    ...createProjectFlag(),
  };

  protected async execute(): Promise<void> {
    const project = await parseProjectFlag(this.flags);

    // TODO(jmerle): Implement
  }
}
