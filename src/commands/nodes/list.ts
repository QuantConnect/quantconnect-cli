import { BaseCommand } from '../../BaseCommand';
import { formatNumber } from '../../utils/format';
import { logger } from '../../utils/logger';

export default class ListNodesCommand extends BaseCommand {
  public static description = 'list all nodes in an organization';

  public static flags = {
    ...BaseCommand.flags,
    ...BaseCommand.createOrganizationFlag(),
  };

  protected async execute(): Promise<void> {
    const organizationId = await this.parseOrganizationFlag();

    const nodes = await this.api.nodes.getAll(organizationId);

    this.logNodes('Backtest', nodes.backtest);
    this.logNodes('Research', nodes.research);
    this.logNodes('Live', nodes.live);
  }

  private logNodes(category: string, nodes: QCNode[]): void {
    if (nodes.length === 0) {
      return;
    }

    logger.info(`${category} nodes (${formatNumber(nodes.length)}):`);

    const rows: any[][] = [['Name', 'Description', 'Busy']];

    for (const node of nodes) {
      rows.push([node.name, node.description, node.busy ? 'Yes' : 'No']);
    }

    logger.table(rows);
  }
}
