import { flags } from '@oclif/command';
import * as fs from 'fs-extra';
import { BaseCommand } from '../../BaseCommand';
import { config } from '../../utils/config';
import { logger } from '../../utils/logger';
import {
  addToProjectIndex,
  getFilesInProject,
  getProjectFilePath,
  getProjectPath,
  pruneProjectIndex,
} from '../../utils/sync';
import { formatAmount, formatPath } from '../../utils/format';

export default class PullCommand extends BaseCommand {
  public static description = 'pull all projects from QuantConnect to the current directory';

  public static flags = {
    ...BaseCommand.flags,
    overwrite: flags.boolean({
      char: 'o',
      description: 'overwrite local files even if local version is newer',
      default: false,
    }),
  };

  private overwriteableCount = 0;

  protected async execute(): Promise<void> {
    pruneProjectIndex();

    const projects = await this.api.projects.getAll();
    for (const project of projects) {
      const projectPath = getProjectPath(project);

      if (fs.existsSync(projectPath)) {
        const existingId = config.get('projectIndex')[project.name];

        if (existingId === project.projectId) {
          await this.updateProject(project);
        } else {
          const currentName = project.name;
          const currentId = project.projectId;

          logger.warn(
            `Project '${currentName}' with id ${currentId} cannot be pulled because there exists another project with the same name with id ${existingId}`,
          );
        }
      } else {
        await this.createProject(project);
      }
    }

    if (this.overwriteableCount > 0) {
      const amount = formatAmount('file', this.overwriteableCount);
      logger.info(`Skipped ${amount} because the local file was newer (use --overwrite to overwrite them)`);
    }

    const projectIndex = config.get('projectIndex');
    for (const name in projectIndex) {
      if (!projects.some(p => p.projectId === projectIndex[name])) {
        logger.warn(`Local project '${name}' with id ${projectIndex[name]} does not exist on QuantConnect`);
      }
    }
  }

  private async createProject(project: QCProject): Promise<void> {
    addToProjectIndex(project);

    fs.ensureDirSync(getProjectPath(project));
    logger.info(`Successfully created directory for project '${project.name}'`);

    const files = await this.api.files.getAll(project.projectId);
    for (const file of files) {
      const filePath = getProjectFilePath(project, file);
      fs.outputFileSync(filePath, file.content);
      logger.info(`Successfully pulled '${formatPath(project, file)}'`);
    }
  }

  private async updateProject(project: QCProject): Promise<void> {
    const files = await this.api.files.getAll(project.projectId);
    for (const file of files) {
      const filePath = getProjectFilePath(project, file);

      if (this.flags.overwrite || !fs.existsSync(filePath) || file.modified >= fs.statSync(filePath).mtime) {
        await fs.outputFileSync(filePath, file.content);
        logger.info(`Successfully pulled '${formatPath(project, file)}'`);
      } else {
        this.overwriteableCount++;
      }
    }

    for (const file of getFilesInProject(project)) {
      if (!files.some(f => f.name === file)) {
        logger.warn(
          `File '${project.name}/${file}' not found on QuantConnect, remove it or push it with 'qcli files:push'`,
        );
      }
    }
  }
}
