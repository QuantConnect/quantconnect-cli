import { BaseCommand } from '../../BaseCommand';
import { compileProject } from '../../utils/api';

export default class CompileProjectCommand extends BaseCommand {
  public static description = 'compile a project';

  public static flags = {
    ...BaseCommand.flags,
    ...BaseCommand.createProjectFlag(),
  };

  protected async execute(): Promise<void> {
    const project = await this.parseProjectFlag();

    await compileProject(this.api, project);
  }
}
