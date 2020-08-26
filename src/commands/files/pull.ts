import * as fs from 'fs-extra';
import { flags } from '@oclif/command';
import { BaseCommand } from '../../BaseCommand';
import { config } from '../../utils/config';
import { logger } from '../../utils/logger';
import {
  addToProjectIndex,
  getFilesInProject,
  getProjectFilePath,
  getProjectPath,
  pruneProjectIndex,
  warnAboutLibraryFiles,
} from '../../utils/sync';
import { pluralize } from '../../utils/format';

export default class PullCommand extends BaseCommand {
  public static description = 'pull files from QuantConnect to the current directory';

  public static flags = {
    ...BaseCommand.flags,
    project: flags.string({
      char: 'p',
      description: 'project id or name of the project to pull (all projects if not specified)',
    }),
  };

  private libraryFiles: string[] = [];

  protected async execute(): Promise<void> {
    pruneProjectIndex();

    let projectToPull: QCProject = null;
    if (this.flags.project !== undefined) {
      projectToPull = await this.parseProjectFlag();
    }

    logger.info('Started looking for files to pull');

    const projects = await this.api.projects.getAll();
    for (const project of projects) {
      if (projectToPull !== null && project.projectId !== projectToPull.projectId) {
        continue;
      }

      if (fs.existsSync(getProjectPath(project))) {
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

    const projectIndex = config.get('projectIndex');
    for (const name in projectIndex) {
      if (!projects.some(p => p.projectId === projectIndex[name])) {
        logger.warn(`Local project '${name}' with id ${projectIndex[name]} does not exist on QuantConnect`);
      }
    }

    warnAboutLibraryFiles(this.libraryFiles, 'pulled');
  }

  private async createProject(project: QCProject): Promise<void> {
    addToProjectIndex(project);

    fs.ensureDirSync(getProjectPath(project));
    logger.info(`Successfully created directory for project '${project.name}'`);

    const files = await this.api.files.getAll(project.projectId);
    for (const file of files) {
      if (file.isLibrary) {
        continue;
      }

      const filePath = getProjectFilePath(project, file);
      fs.outputFileSync(filePath, file.content);

      logger.info(`Successfully pulled '${project.name}/${file.name}'`);
    }
  }

  private async updateProject(project: QCProject): Promise<void> {
    const remoteFiles = await this.api.files.getAll(project.projectId);

    for (const remoteFile of remoteFiles) {
      const filePath = getProjectFilePath(project, remoteFile);
      const localContent = fs.existsSync(filePath) ? fs.readFileSync(filePath).toString() : '';

      if (remoteFile.content.trim() !== localContent.trim()) {
        if (remoteFile.isLibrary) {
          if (fs.existsSync(filePath)) {
            this.libraryFiles.push(`${project.name}/${remoteFile.name}`);
          }

          continue;
        }

        await fs.outputFileSync(filePath, remoteFile.content);

        logger.info(`Successfully pulled '${project.name}/${remoteFile.name}'`);
      }
    }

    for (const localFile of getFilesInProject(project)) {
      if (!remoteFiles.some(f => f.name === localFile)) {
        logger.warn(
          `File '${project.name}/${localFile}' not found on QuantConnect, remove it or push it with 'qcli files:push'`,
        );
      }
    }
  }
}
