import { BaseCommand } from '../../BaseCommand';

export default class ListProjectsCommand extends BaseCommand {
  public static description = 'list all projects and libraries';

  public static flags = {
    ...BaseCommand.flags,
  };

  public async run(): Promise<void> {
    // TODO(jmerle): Implement
  }
}
