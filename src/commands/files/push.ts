import { flags } from '@oclif/command';
import * as fs from 'fs-extra';
import { BaseCommand } from '../../BaseCommand';
import { getFilesInProject, getProjectFilePath, getProjectPath, pruneProjectIndex } from '../../utils/sync';
import { config } from '../../utils/config';
import { logger } from '../../utils/logger';

export default class PushCommand extends BaseCommand {
  public static description = 'push local files to QuantConnect';

  public static flags = {
    ...BaseCommand.flags,
    project: flags.string({
      char: 'p',
      description: 'project id or name of the project to push (all projects if not specified)',
    }),
  };

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
  }

  private async pushProject(project: QCProject): Promise<void> {
    const remoteFiles = await this.api.files.getAll(project.projectId);
    const localFiles = getFilesInProject(project);

    for (const localFile of localFiles) {
      const remoteFile = remoteFiles.find(f => f.name === localFile);
      const localContent = fs.readFileSync(getProjectFilePath(project, localFile)).toString();

      if (remoteFile === undefined) {
        await this.api.files.create(project.projectId, localFile, localContent);
      } else if (remoteFile.content.trim() !== localContent.trim()) {
        await this.api.files.update(project.projectId, localFile, localContent);
      } else {
        continue;
      }

      logger.info(`Successfully pushed '${project.name}/${localFile}'`);
    }
  }
}
