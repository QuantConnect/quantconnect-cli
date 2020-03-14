import { BaseCommand } from '../../BaseCommand';

export default class DeleteProjectCommand extends BaseCommand {
  public static description = 'delete a project';

  public static flags = {
    ...BaseCommand.flags,
  };

  public async run(): Promise<void> {
    // TODO(jmerle): Implement
  }
}
