import Command, { flags } from '@oclif/command';
import { OutputArgs, OutputFlags } from '@oclif/parser';
import { logger } from './utils/logger';
import { config } from './utils/config';
import { APIClient } from './api/APIClient';
import { formatDate } from './utils/format';

type Flag<T> = { [key: string]: flags.IOptionFlag<T> };

export abstract class BaseCommand extends Command {
  public static flags = {
    help: flags.help({
      char: 'h',
      description: 'display usage information',
    }),
    version: flags.version({
      char: 'v',
      description: 'display version information',
    }),
  };

  protected args: OutputArgs<any>;
  protected flags: OutputFlags<any>;

  protected api: APIClient;

  protected abstract execute(): Promise<void>;

  protected async init(): Promise<void> {
    super.init();

    const data = this.parse(this.constructor as any);

    this.args = data.args;
    this.flags = data.flags;
  }

  public async run(): Promise<void> {
    if (this.constructor.name !== 'InitCommand' && !config.fileExists()) {
      if (config.fileExists()) {
        this.api = new APIClient(config.get('userId'), config.get('apiToken'));
      } else {
        logger.error("You're not in a QuantConnect CLI project");
        logger.error("You can create one by running 'qcli init' in an empty directory");
        process.exit(1);
      }
    }

    try {
      await this.execute();
    } catch (err) {
      if (err.code !== 'EEXIT') {
        logger.error(err.message);
      }

      process.exit(1);
    }
  }

  protected static createProjectFlag(): Flag<string> {
    return {
      project: flags.string({
        char: 'p',
        description: 'project id or name (optional, interactive selector opens if not specified)',
      }),
    };
  }

  protected static createBacktestFlag(): Flag<string> {
    return {
      backtest: flags.string({
        char: 'b',
        description: 'backtest id or name (optional, interactive selector opens if not specified)',
      }),
    };
  }

  protected async parseProjectFlag(): Promise<QCProject> {
    const projects = await this.api.projects.getAll();

    if (this.flags.project !== undefined) {
      const input = this.flags.project;
      const matchingProjects = projects.filter(p => p.projectId === Number(input) || p.name === input);

      if (matchingProjects.length === 0) {
        throw new Error('No project with the given id or name found');
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

  protected async parseBacktestFlag(projectId: number): Promise<QCBacktest> {
    const backtests = await this.api.backtests.getAll(projectId);

    if (this.flags.backtest !== undefined) {
      const input = this.flags.backtest;
      const matchingBacktests = backtests.filter(b => b.backtestId === input || b.name === input);

      if (matchingBacktests.length === 0) {
        throw new Error('No backtest with the given id or name found in the selected project');
      }

      if (matchingBacktests.length > 1) {
        throw new Error(
          'There are multiple backtests with the given name in the selected project, please specify an id',
        );
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

  protected static formatExamples(examples: string[]): string[] {
    return examples.map((example, index) => {
      const suffix = index !== examples.length - 1 ? '\n' : '';
      return example.trim() + suffix;
    });
  }
}
