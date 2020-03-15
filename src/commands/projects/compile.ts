import { BaseCommand } from '../../BaseCommand';
import { createProjectFlag, parseProjectFlag } from '../../utils/command';
import { APIClient } from '../../api/APIClient';
import { logger } from '../../utils/logger';
import { sleep } from '../../utils/sleep';

export default class CompileProjectCommand extends BaseCommand {
  public static description = 'compile a project';

  public static flags = {
    ...BaseCommand.flags,
    ...createProjectFlag(),
  };

  protected async execute(): Promise<void> {
    const project = await parseProjectFlag(this.flags);

    const api = new APIClient();
    let compile = await api.compiles.create(project.projectId);
    logger.info(`Started compiling project '${project.name}'`);

    while (true) {
      compile = await api.compiles.get(project.projectId, compile.compileId);

      if (compile.state === 'BuildSuccess' || compile.state === 'BuildError') {
        break;
      }

      await sleep(250);
    }

    logger.info(compile.logs.join('\n'));

    if (compile.state === 'BuildError') {
      logger.error(`Something went wrong while compiling project '${project.name}'`);
      process.exit(1);
    }

    logger.info(`Successfully compiled project '${project.name}'`);
  }
}
