import { APIClient } from '../api/APIClient';
import { logger } from './logger';
import { sleep } from './promises';

export async function compileProject(api: APIClient, project: QCProject): Promise<QCCompile> {
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
    throw new Error(`Something went wrong while compiling project '${project.name}'`);
  }

  logger.info(`Successfully compiled project '${project.name}'`);

  return compile;
}
