import * as fs from 'fs';
import { flags } from '@oclif/command';
import { BaseCommand } from '../../BaseCommand';
import { formatLanguage } from '../../utils/format';
import { logger } from '../../utils/logger';
import { addToProjectIndex, getProjectPath } from '../../utils/sync';
import PullCommand from '../files/pull';
import PushCommand from '../files/push';

export default class NewProjectCommand extends BaseCommand {
  public static description = 'create a new project';

  public static flags = {
    ...BaseCommand.flags,
    language: flags.string({
      char: 'l',
      description: 'language of the project to create',
      options: ['python', 'csharp'],
      default: 'python',
    }),
  };

  public static args = [
    {
      name: 'path',
      description: 'path of the project to create',
      required: true,
    },
  ];

  protected async execute(): Promise<void> {
    const newAbsolutePath = getProjectPath(this.args.path);

    const existingProjects = await this.api.projects.getAll();
    const existingPaths = existingProjects.map(project => getProjectPath(project));

    if (existingPaths.map(p => p.toLowerCase()).includes(newAbsolutePath.toLowerCase())) {
      throw new Error(`There already exists a project with the given path`);
    }

    const language = ({
      python: 'Py',
      csharp: 'C#',
    } as Record<string, QCLanguage>)[this.flags.language];

    const newProject = await this.api.projects.create(this.args.path, language);

    logger.info(`Successfully created ${formatLanguage(language)} project '${this.args.path}'`);

    if (fs.existsSync(newAbsolutePath)) {
      addToProjectIndex(newProject);
      await PushCommand.run(['-p', this.args.path]);
    } else {
      await PullCommand.run(['-p', this.args.path]);
    }
  }
}
