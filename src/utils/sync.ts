import * as path from 'path';
import * as fs from 'fs-extra';
import * as klawSync from 'klaw-sync';
import { config } from './config';
import { pluralize } from './format';
import { logger } from './logger';

function getName(thing: { name: string } | string): string {
  return typeof thing === 'string' ? thing : thing.name;
}

export function pruneProjectIndex(): void {
  const projectIndex = config.get('projectIndex');

  for (const name in projectIndex) {
    const directory = path.resolve(process.cwd(), name);
    if (!fs.existsSync(directory)) {
      delete projectIndex[name];
    }
  }

  config.set('projectIndex', projectIndex);
}

export function addToProjectIndex(project: QCProject): void {
  const projectIndex = config.get('projectIndex');
  projectIndex[project.name] = project.projectId;
  config.set('projectIndex', projectIndex);
}

export function removeFromProjectIndex(project: QCProject | string): boolean {
  const projectIndex = config.get('projectIndex');

  if (getName(project) in projectIndex) {
    delete projectIndex[getName(project)];
    config.set('projectIndex', projectIndex);

    return true;
  }

  return false;
}

export function normalizePath(filePath: string): string {
  return path.normalize(filePath).replace(/\\/g, '/');
}

export function getProjectPath(project: QCProject | string): string {
  return path.resolve(process.cwd(), getName(project));
}

export function getProjectFilePath(project: QCProject | string, file: QCFile | string): string {
  return path.resolve(getProjectPath(project), getName(file));
}

export function getProjectName(file: QCFile | string): string {
  const relativePath = normalizePath(path.relative(process.cwd(), getName(file)));

  let bestMatch = '';

  for (const name in config.get('projectIndex')) {
    if (relativePath.startsWith(name) && (bestMatch === '' || name.length > bestMatch.length)) {
      bestMatch = name;
    }
  }

  return bestMatch;
}

export function getFilePathRelativeToProject(project: QCProject | string, file: QCFile | string): string {
  return normalizePath(path.relative(getProjectPath(project), getName(file)));
}

export function getFilesInProject(project: QCProject | string): string[] {
  const paths = klawSync(getProjectPath(project), { nodir: true });
  return paths.map(path => getFilePathRelativeToProject(project, path.path));
}

export function warnAboutLibraryFiles(libraryFiles: string[], action: string): void {
  const fileCount = libraryFiles.length;

  if (fileCount === 0) {
    return;
  }

  const filesStr = pluralize(fileCount, 'file');
  const wereStr = pluralize(fileCount, 'was', 'were');
  const theseStr = pluralize(fileCount, 'this', 'these');
  const theirStr = pluralize(fileCount, 'its', 'their');
  const projectsStr = pluralize(fileCount, 'project');

  logger.warn('QuantConnect CLI no longer treats files from linked libraries as in-project files');
  logger.warn(`For that reason the following ${filesStr} ${wereStr} not ${action}:`);

  for (const file of libraryFiles) {
    logger.warn(`- ${file}`);
  }

  logger.warn(`You can safely remove ${theseStr} ${filesStr} from your local disk`);
  logger.warn(
    `In the future please edit ${theseStr} ${filesStr} in ${theirStr} ${projectsStr} in the 'Library' directory`,
  );
}
