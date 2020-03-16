import { BaseCommand } from '../../BaseCommand';
import { logger } from '../../utils/logger';
import { formatAmount, formatDate, formatLanguage } from '../../utils/format';

export default class ListProjectsCommand extends BaseCommand {
  public static description = 'list all projects';

  public static flags = {
    ...BaseCommand.flags,
  };

  protected async execute(): Promise<void> {
    const projects = await this.api.projects.getAll();
    logger.info(`Found ${formatAmount('project', projects.length)}`);

    if (projects.length === 0) {
      return;
    }

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
