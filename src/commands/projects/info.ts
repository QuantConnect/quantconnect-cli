import { BaseCommand } from '../../BaseCommand';
import { logger } from '../../utils/logger';
import { formatDate, formatLanguage } from '../../utils/format';

export default class InfoProjectCommand extends BaseCommand {
  public static description = 'display useful information about a project';

  public static flags = {
    ...BaseCommand.flags,
    ...BaseCommand.createProjectFlag(),
  };

  protected async execute(): Promise<void> {
    const project = await this.parseProjectFlag();

    logger.info(`Name: ${project.name}`);
    logger.info(`Language: ${formatLanguage(project.language)}`);
    logger.info(`Organization: ${project.organizationId}`);
    logger.info(`Last modified: ${formatDate(project.modified)}`);
    logger.info(`Created: ${formatDate(project.created)}`);

    const pinnedToMaster = `${project.leanPinnedToMaster ? '' : 'not '}pinned to master`;
    logger.info(`Lean version id: ${project.leanVersionId} (${pinnedToMaster})`);

    logger.info(`Deployed live: ${project.liveResults.eStatus === 'Running' ? 'Yes' : 'No'}`);

    logger.info(`Collaborators (${project.collaborators.length}):`);
    for (const collaborator of project.collaborators) {
      const hasLiveControl = collaborator.blivecontrol ? ' (has live control)' : '';
      logger.info(`- ${collaborator.name}${hasLiveControl}`);
    }

    const libraryCount = project.libraries.length;
    if (libraryCount === 0) {
      logger.info(`Linked libraries: none`);
    } else {
      const projects = await this.api.projects.getAll();

      logger.info(`Linked libraries (${libraryCount}):`);

      for (const library of project.libraries) {
        const libraryProject = projects.find(p => p.projectId === library);
        logger.info(`- ${libraryProject.name} (${libraryProject.projectId})`);
      }
    }
  }
}
