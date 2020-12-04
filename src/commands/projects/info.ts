import { BaseCommand } from '../../BaseCommand';
import { formatDate, formatLanguage, formatNumber } from '../../utils/format';
import { logger } from '../../utils/logger';

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

    logger.info(`Collaborators (${formatNumber(project.collaborators.length)}):`);
    for (const collaborator of project.collaborators) {
      const hasLiveControl = collaborator.blivecontrol ? ' (has live control)' : '';
      logger.info(`- ${collaborator.name}${hasLiveControl}`);
    }

    const libraryCount = project.libraries.length;
    if (libraryCount === 0) {
      logger.info(`Linked libraries: none`);
    } else {
      const projects = await this.api.projects.getAll();

      logger.info(`Linked libraries (${formatNumber(libraryCount)}):`);

      for (const library of project.libraries) {
        const libraryProject = projects.find(p => p.projectId === library);
        logger.info(`- ${libraryProject.name} (${libraryProject.projectId})`);
      }
    }

    const parameterCount = project.parameters.length;
    if (parameterCount === 0) {
      logger.info('Parameters: none');
    } else {
      logger.info(`Parameters (${formatNumber(parameterCount)}):`);
      for (const parameter of project.parameters) {
        logger.info(`- ${parameter.key} = '${parameter.value}'`);
      }
    }
  }
}
