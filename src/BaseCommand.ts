import Command, { flags } from '@oclif/command';
import { OutputArgs, OutputFlags } from '@oclif/parser';
import { APIClient } from './api/APIClient';
import { config } from './utils/config';
import { formatDate } from './utils/format';
import { logger } from './utils/logger';

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
    verbose: flags.boolean({
      description: 'display API requests as they happen',
      default: false,
    }),
  };

  protected args: OutputArgs<any>;
  protected flags: OutputFlags<any>;

  protected api: APIClient;

  protected abstract execute(): Promise<void>;

  protected async init(): Promise<void> {
    await super.init();

    const data = this.parse(this.constructor as any);

    this.args = data.args;
    this.flags = data.flags;
  }

  public async run(): Promise<void> {
    if (this.flags.verbose) {
      logger.enableVerboseMessages();
    }

    if (this.constructor.name !== 'InitCommand') {
      if (config.fileExists()) {
        this.api = new APIClient(config.get('userId'), config.get('apiToken'));
      } else {
        logger.error("You're not in a QuantConnect CLI project, you can create one by running 'qcli init'");
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

  protected static createOrganizationFlag(): Flag<string> {
    return {
      organization: flags.string({
        char: 'o',
        // TODO: Allow organization name as input when the API endpoint for organizations is live
        description: 'organization id (optional, interactive selector opens if not specified)',
      }),
    };
  }

  protected static createNodeFlag(): Flag<string> {
    return {
      node: flags.string({
        char: 'n',
        description: 'node id or name (optional, interactive selector opens if not specified)',
      }),
    };
  }

  protected async parseProjectFlag(): Promise<QCProject> {
    const projects = await this.api.projects.getAll();

    return this.selectItem(
      'project',
      projects,
      this.flags.project,
      (project, input) => project.projectId === Number(input) || project.name === input,
      (a, b) => b.modified.getTime() - a.modified.getTime(),
      project => `${project.projectId} - ${project.name}`,
    );
  }

  protected async parseBacktestFlag(projectId: number): Promise<QCBacktest> {
    const backtests = await this.api.backtests.getAll(projectId);

    return await this.selectItem(
      'backtest',
      backtests,
      this.flags.backtest,
      (backtest, input) => backtest.backtestId === input || backtest.name === input,
      (a, b) => b.created.getTime() - a.created.getTime(),
      backtest => `${backtest.backtestId} - ${formatDate(backtest.created)} - ${backtest.name}`,
    );
  }

  protected async parseOrganizationFlag(): Promise<string> {
    const projects = await this.api.projects.getAll();
    const organizations = [...new Set(projects.map(project => project.organizationId))];

    // TODO: Improve selector to show names alongside ids when the API endpoint for organizations is live
    return await this.selectItem(
      'organization',
      organizations,
      this.flags.organization,
      (organization, input) => organization === input,
      (a, b) => a.localeCompare(b),
      organization => organization,
    );
  }

  protected async parseNodeFlag(organizationId: string, type?: keyof QCNodeList): Promise<QCNode> {
    const nodes = await this.api.nodes.getAll(organizationId);
    const allNodes = type !== undefined ? nodes[type] : nodes.backtest.concat(nodes.research).concat(nodes.live);

    return await this.selectItem(
      'node',
      allNodes,
      this.flags.node,
      (node, input) => node.id === input || node.name === input,
      (a, b) => a.sku.localeCompare(b.sku),
      node => {
        let type;
        switch (node.sku[0]) {
          case 'B':
            type = 'Backtest';
            break;
          case 'R':
            type = 'Research';
            break;
          case 'L':
            type = 'Live';
            break;
          default:
            type = 'Unknown';
            break;
        }

        return `${type} node - ${node.id} - ${node.name} - ${node.description}`;
      },
    );
  }

  private async selectItem<T>(
    itemName: string,
    allItems: T[],
    input: string,
    inputChecker: (item: T, input: string) => boolean,
    itemSorter: (itemA: T, itemB: T) => number,
    itemLabeler: (item: T) => string,
  ): Promise<T> {
    if (input !== undefined) {
      const matchingItems = allItems.filter(item => inputChecker(item, input));

      if (matchingItems.length === 0) {
        throw new Error(`No ${itemName} with the given id or name exists`);
      }

      if (matchingItems.length > 1) {
        throw new Error(`There are multiple ${itemName}s with the given name, please specify an id`);
      }

      return matchingItems[0];
    }

    if (allItems.length === 0) {
      throw new Error(`No ${itemName}s found to select from`);
    }

    const options: Array<[T, string]> = allItems
      .sort((a, b) => itemSorter(a, b))
      .map(item => [item, itemLabeler(item)]);

    const aStr = 'aeiou'.split('').includes(itemName[0]) ? 'an' : 'a';

    return await logger.askAutocomplete(`Select ${aStr} ${itemName}`, options);
  }

  protected static formatExamples(examples: string[]): string[] {
    return examples.map((example, index) => {
      const suffix = index !== examples.length - 1 ? '\n' : '';
      return example.trim() + suffix;
    });
  }
}
