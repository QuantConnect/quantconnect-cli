import * as path from 'path';
import { flags } from '@oclif/command';
import * as fs from 'fs-extra';
import * as chokidar from 'chokidar';
import * as PromiseQueue from 'promise-queue';
import { BaseCommand } from '../../BaseCommand';
import {
  getFilePathRelativeToProject,
  getFilesInProject,
  getProjectFilePath,
  getProjectName,
  getProjectPath,
  pruneProjectIndex,
} from '../../utils/sync';
import { config } from '../../utils/config';
import { logger } from '../../utils/logger';

export default class PushCommand extends BaseCommand {
  public static description = 'push local files to QuantConnect';

  public static flags = {
    ...BaseCommand.flags,
    project: flags.string({
      char: 'p',
      description: 'project id or name of the project to push/watch (all projects if not specified)',
    }),
    watch: flags.boolean({
      char: 'w',
      description: 'watch for local file changes and push them to QuantConnect after the initial push',
      default: false,
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

    if (this.flags.watch) {
      this.startWatching(projectToPush);
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

  private startWatching(projectToWatch: QCProject): void {
    const glob = projectToWatch !== null ? path.join(getProjectPath(projectToWatch), '**/*') : '**/*';
    const watcher = chokidar.watch(glob, {
      ignoreInitial: true,
      cwd: process.cwd(),
      usePolling: true,
    });

    const queue = new PromiseQueue(1, Infinity);

    watcher
      .on('ready', () => logger.info('Started watcher'))
      .on('add', file => queue.add(() => this.onChange(file)))
      .on('change', file => queue.add(() => this.onChange(file)))
      .on('unlink', file => queue.add(() => this.onDelete(file)));
  }

  private async onChange(file: string): Promise<void> {
    if (this.isDirectory(file)) {
      return;
    }

    const projectName = getProjectName(file);
    const projectId = config.get('projectIndex')[projectName];

    if (projectId === undefined) {
      return;
    }

    const absolutePath = path.resolve(process.cwd(), file);
    const relativePath = getFilePathRelativeToProject(projectName, absolutePath);

    const fileContent = fs.readFileSync(absolutePath).toString();

    if (fileContent === '') {
      return;
    }

    try {
      await this.api.files.update(projectId, relativePath, fileContent);
      logger.info(`Successfully pushed update to '${file}'`);
    } catch (err) {
      logger.error(`Could not push update to '${file}': ${err.message}`);
    }
  }

  private async onDelete(file: string): Promise<void> {
    if (this.isDirectory(file)) {
      return;
    }

    const projectName = getProjectName(file);
    const projectId = config.get('projectIndex')[projectName];

    if (projectId === undefined) {
      return;
    }

    const absolutePath = path.resolve(process.cwd(), file);
    const relativePath = getFilePathRelativeToProject(projectName, absolutePath);

    try {
      await this.api.files.delete(projectId, relativePath);
      logger.info(`Successfully pushed deletion of '${file}'`);
    } catch (err) {
      logger.error(`Could not push deletion of '${file}': ${err.message}`);
    }
  }

  private isDirectory(file: string): boolean {
    return fs.existsSync(file) ? fs.statSync(file).isDirectory() : path.extname(file) === '';
  }
}
