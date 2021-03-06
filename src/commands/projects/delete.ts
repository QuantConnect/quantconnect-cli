import * as fs from 'fs-extra';
import { BaseCommand } from '../../BaseCommand';
import { logger } from '../../utils/logger';
import { getProjectPath, removeFromProjectIndex } from '../../utils/sync';

export default class DeleteProjectCommand extends BaseCommand {
  public static description = 'delete a project';

  public static flags = {
    ...BaseCommand.flags,
    ...BaseCommand.createProjectFlag(),
  };

  protected async execute(): Promise<void> {
    const project = await this.parseProjectFlag();

    const confirmation = await logger.askBoolean(`Are you sure you want to delete project '${project.name}'?`, false);
    if (!confirmation) {
      return;
    }

    await this.api.projects.delete(project.projectId);

    if (removeFromProjectIndex(project)) {
      fs.removeSync(getProjectPath(project));
    }

    logger.info(`Successfully deleted project '${project.name}'`);
  }
}
