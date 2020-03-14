import { BaseCommand } from '../../BaseCommand';

export default class NewProjectCommand extends BaseCommand {
  public static description = 'create a new project';

  public static flags = {
    ...BaseCommand.flags,
  };

  public async run(): Promise<void> {
    // TODO(jmerle): Implement
  }
}
