import * as path from 'path';
import { flags } from '@oclif/command';
import * as fs from 'fs-extra';
import * as chokidar from 'chokidar';
import * as PromiseQueue from 'promise-queue';
import { BaseCommand } from '../../BaseCommand';
import { getFilePathRelativeToProject, getProjectName, getProjectPath, pruneProjectIndex } from '../../utils/sync';
import { config } from '../../utils/config';
import { logger } from '../../utils/logger';

export default class WatchCommand extends BaseCommand {
  public static description = 'watch for local file changes and push them to QuantConnect';

  public static flags = {
    ...BaseCommand.flags,
    project: flags.string({
      char: 'p',
      description: 'project id or name of the project to watch (all projects if not specified)',
    }),
  };

  protected async execute(): Promise<void> {
    pruneProjectIndex();

    let projectToWatch: QCProject = null;
    if (this.flags.project !== undefined) {
      projectToWatch = await this.parseProjectFlag();
    }

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
    if (this.shouldIgnoreFile(file)) {
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
    if (this.shouldIgnoreFile(file)) {
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

  private shouldIgnoreFile(file: string): boolean {
    if (file.endsWith('~')) {
      return true;
    }

    return fs.existsSync(file) ? fs.statSync(file).isDirectory() : path.extname(file) === '';
  }
}
