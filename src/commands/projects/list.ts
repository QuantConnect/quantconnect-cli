import { BaseCommand } from '../../BaseCommand';
import { APIClient } from '../../api/APIClient';
import { logger } from '../../utils/logger';
import { formatDate, formatLanguage } from '../../utils/format';

export default class ListProjectsCommand extends BaseCommand {
  public static description = 'list all projects';

  public static flags = {
    ...BaseCommand.flags,
  };

  protected async execute(): Promise<void> {
    const api = new APIClient();
    const projects = await api.projects.getAll();

    logger.info(`Found ${projects.length} projects`);

    const rows: any[][] = [['ID', 'Language', 'Name', 'Created', 'Modified']];

    for (const project of projects) {
      rows.push([
        project.projectId,
        formatLanguage(project.language),
        project.name,
        formatDate(project.created),
        formatDate(project.modified),
      ]);
    }

    logger.table(rows);
  }
}
