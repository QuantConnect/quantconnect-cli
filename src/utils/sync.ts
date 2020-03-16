import * as path from 'path';
import * as fs from 'fs-extra';
import * as klawSync from 'klaw-sync';
import { config } from './config';

function getName(item: QCProject | QCFile | string): string {
  return typeof item === 'string' ? item : item.name;
}

function normalizePath(filePath: string): string {
  return path.normalize(filePath).replace(/\\/g, '/');
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
