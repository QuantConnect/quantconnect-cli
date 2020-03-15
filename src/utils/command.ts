import { flags } from '@oclif/command';
import { OutputFlags } from '@oclif/parser';
import { APIClient } from '../api/APIClient';
import { logger } from './logger';
import { formatDate } from './format';

type Flag<T> = { [key: string]: flags.IOptionFlag<T> };

export function formatExamples(examples: string[]): string[] {
  return examples.map((example, index) => {
    const suffix = index !== examples.length - 1 ? '\n' : '';
    return example.trim() + suffix;
  });
}

export function createProjectFlag(): Flag<string> {
  return {
    project: flags.string({
      char: 'p',
      description: 'project id or name (optional, interactive selector opens if not specified)',
    }),
  };
}

export function createBacktestFlag(): Flag<string> {
  return {
    backtest: flags.string({
      char: 'b',
      description: 'backtest id or name (optional, interactive selector opens if not specified)',
    }),
  };
}

export async function parseProjectFlag(flags: OutputFlags<any>): Promise<QCProject> {
  const api = new APIClient();
  const projects = await api.projects.getAll();

  if (flags.project !== undefined) {
    const input = flags.project;
    const matchingProjects = projects.filter(p => p.projectId === Number(input) || p.name === input);

    if (matchingProjects.length === 0) {
      throw new Error('No project with the given name found');
    }

    if (matchingProjects.length > 1) {
      throw new Error('There are multiple backtests with the given name, please specify an id');
    }

    return matchingProjects[0];
  }

  if (projects.length === 0) {
    throw new Error('There are no projects');
  }

  const options: Array<[string, QCProject]> = projects
    .sort((a, b) => b.modified.getTime() - a.modified.getTime())
    .map(project => [`${project.projectId} - ${project.name}`, project]);

  const selectedOption = await logger.askAutocomplete(
    'Select a project',
    options.map(option => option[0]),
  );

  return options.find(option => option[0] === selectedOption)[1];
}

export async function parseBacktestFlag(projectId: number, flags: OutputFlags<any>): Promise<QCBacktest> {
  const api = new APIClient();
  const backtests = await api.backtests.getAll(projectId);

  if (flags.backtest !== undefined) {
    const input = flags.backtest;
    const matchingBacktests = backtests.filter(b => b.backtestId === input || b.name === input);

    if (matchingBacktests.length === 0) {
      throw new Error('No backtest with the given id or name found in the selected project');
    }

    if (matchingBacktests.length > 1) {
      throw new Error('There are multiple backtests with the given name in the selected project, please specify an id');
    }

    return matchingBacktests[0];
  }

  if (backtests.length === 0) {
    throw new Error(`Project has no backtests`);
  }

  const options: Array<[string, QCBacktest]> = backtests
    .sort((a, b) => b.created.getTime() - a.created.getTime())
    .map(backtest => [`${backtest.backtestId} - ${formatDate(backtest.created)} - ${backtest.name}`, backtest]);

  const selectedOption = await logger.askAutocomplete(
    'Select a backtest',
    options.map(option => option[0]),
  );

  return options.find(option => option[0] === selectedOption)[1];
}
