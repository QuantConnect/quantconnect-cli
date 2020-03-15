import { BaseCommand } from '../../BaseCommand';
import { createProjectFlag, parseProjectFlag } from '../../utils/command';
import { APIClient } from '../../api/APIClient';
import { logger } from '../../utils/logger';

export default class DeleteProjectCommand extends BaseCommand {
  public static description = 'delete a project';

  public static flags = {
    ...BaseCommand.flags,
    ...createProjectFlag(),
  };

  protected async execute(): Promise<void> {
    const project = await parseProjectFlag(this.flags);

    const confirmation = await logger.askBoolean(`Are you sure you want to delete project '${project.name}'`, false);
    if (!confirmation) {
      return;
    }

    const api = new APIClient();
    await api.projects.delete(project.projectId);

    logger.info(`Successfully deleted project '${project.name}'`);
  }
}
