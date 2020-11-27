import { flags } from '@oclif/command';
import * as fs from 'fs-extra';
import { BaseCommand } from '../../BaseCommand';
import { config } from '../../utils/config';
import { logger } from '../../utils/logger';
import {
  getFilesInProject,
  getProjectFilePath,
  getProjectPath,
  pruneProjectIndex,
  warnAboutLibraryFiles,
} from '../../utils/sync';

export default class PushCommand extends BaseCommand {
  public static description = 'push local files to QuantConnect';

  public static flags = {
    ...BaseCommand.flags,
    project: flags.string({
      char: 'p',
      description: 'project id or name of the project to push (all projects if not specified)',
    }),
  };

  private libraryFiles: string[] = [];

  protected async execute(): Promise<void> {
    pruneProjectIndex();

    let projectToPush: QCProject = null;
    if (this.flags.project !== undefined) {
      projectToPush = await this.parseProjectFlag();
    }

    logger.info('Started looking for files to push');

    const projects = await this.api.projects.getAll();
    for (const project of projects) {
      if (projectToPush !== null && project.projectId !== projectToPush.projectId) {
        continue;
      }

      if (fs.existsSync(getProjectPath(project))) {
        const existingId = config.get('projectIndex')[project.name];
        if (project.projectId === existingId) {
          await this.pushProject(project);
        }
      }
    }

    warnAboutLibraryFiles(this.libraryFiles, 'pushed');
  }

  private async pushProject(project: QCProject): Promise<void> {
    const remoteFiles = await this.api.files.getAll(project.projectId);
    const localFiles = getFilesInProject(project);

    for (const localFile of localFiles) {
      const remoteFile = remoteFiles.find(f => f.name === localFile);
      const localContent = fs.readFileSync(getProjectFilePath(project, localFile)).toString();

      try {
        if (remoteFile === undefined) {
          await this.api.files.create(project.projectId, localFile, localContent);
        } else if (remoteFile.content.trim() !== localContent.trim()) {
          if (remoteFile.isLibrary) {
            this.libraryFiles.push(`${project.name}/${remoteFile.name}`);
            continue;
          }

          await this.api.files.update(project.projectId, localFile, localContent);
        } else {
          continue;
        }

        logger.info(`Successfully pushed '${project.name}/${localFile}'`);
      } catch (err) {
        logger.error(`Could not push '${project.name}/${localFile}': ${err.message}`);
      }
    }
  }
}
