import { BaseCommand } from '../../BaseCommand';

export default class DeleteProjectCommand extends BaseCommand {
  public static description = 'delete a project';

  public static flags = {
    ...BaseCommand.flags,
  };

  protected async execute(): Promise<void> {
    // TODO(jmerle): Implement
  }
}
