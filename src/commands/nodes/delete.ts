import { BaseCommand } from '../../BaseCommand';
import { logger } from '../../utils/logger';

export class DeleteNodeCommand extends BaseCommand {
  public static description = 'delete a node';

  public static flags = {
    ...BaseCommand.flags,
    ...BaseCommand.createOrganizationFlag(),
    ...BaseCommand.createNodeFlag(),
  };

  protected async execute(): Promise<void> {
    const organizationId = await this.parseOrganizationFlag();
    const node = await this.parseNodeFlag(organizationId);

    const nodeType = this.getNodeType(node);

    const allNodes = await this.api.nodes.getAll(organizationId);
    const allNodesOfType = allNodes[nodeType];

    if (allNodesOfType.length === 1) {
      throw new Error(`Cannot delete the last ${nodeType} node`);
    }

    const confirmation = await logger.askBoolean(`Are you sure you want to delete node '${node.name}'?`, false);
    if (!confirmation) {
      return;
    }

    await this.api.nodes.delete(organizationId, node.id);

    logger.info(`Successfully deleted node '${node.name}'`);
  }

  private getNodeType(node: QCNode): keyof QCNodeList {
    switch (node.sku[0]) {
      case 'B':
        return 'backtest';
      case 'R':
        return 'research';
      case 'L':
        return 'live';
      default:
        throw new Error(`Unknown node type '${node.sku[0]}'`);
    }
  }
}
