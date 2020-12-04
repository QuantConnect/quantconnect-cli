import { APIClient } from '../api/APIClient';
import { formatNumber } from './format';
import { logger } from './logger';
import { poll } from './promises';

export async function compileProject(api: APIClient, project: QCProject): Promise<QCCompile> {
  const compile = await api.compiles.create(project.projectId);
  logger.info(`Started compiling project '${project.name}'`);

  const parameters: string[] = [];
  for (const container of compile.parameters) {
    for (const parameter of container.parameters) {
      parameters.push(`- ${container.file}:${parameter.line} :: ${parameter.type}`);
    }
  }

  if (parameters.length > 0) {
    const parameterCount = parameters
      .map(parameter => parseInt(parameter.split(' :: ')[1].split(' ')[0], 10))
      .reduce((acc, val) => acc + val, 0);

    logger.info(`Detected parameters (${formatNumber(parameterCount)}):`);

    for (const parameter of parameters) {
      logger.info(parameter);
    }
  } else {
    logger.info('Detected parameters: none');
  }

  const finishedCompile = await poll({
    makeRequest: () => api.compiles.get(project.projectId, compile.compileId),
    isDone: data => data.state === 'BuildSuccess' || data.state === 'BuildError',
  });

  if (finishedCompile.state === 'BuildError') {
    logger.error(finishedCompile.logs.join('\n'));
    throw new Error(`Something went wrong while compiling project '${project.name}'`);
  }

  logger.info(finishedCompile.logs.join('\n'));
  logger.info(`Successfully compiled project '${project.name}'`);

  return finishedCompile;
}
