import * as fs from 'fs';
import { flags } from '@oclif/command';
import { BaseCommand } from '../../BaseCommand';
import { logger } from '../../utils/logger';
import { formatLanguage } from '../../utils/format';
import PullCommand from '../files/pull';
import PushCommand from '../files/push';
import { addToProjectIndex, getProjectPath } from '../../utils/sync';

export default class NewProjectCommand extends BaseCommand {
  public static description = 'create a new project';

  public static flags = {
    ...BaseCommand.flags,
    language: flags.string({
      char: 'l',
      description: 'language of the project to create',
      options: ['Py', 'C#'],
      default: 'Py',
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

    const newProject = await this.api.projects.create(this.args.path, this.flags.language);

    logger.info(`Successfully created ${formatLanguage(this.flags.language)} project '${this.args.path}'`);

    if (fs.existsSync(newAbsolutePath)) {
      addToProjectIndex(newProject);
      await PushCommand.run(['-p', this.args.path]);
    } else {
      await PullCommand.run(['-p', this.args.path]);
    }
  }
}
