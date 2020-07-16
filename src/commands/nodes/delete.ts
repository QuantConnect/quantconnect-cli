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

    const confirmation = await logger.askBoolean(`Are you sure you want to delete node '${node.name}'?`, false);
    if (!confirmation) {
      return;
    }

    await this.api.nodes.delete(organizationId, node.id);

    logger.info(`Successfully deleted node '${node.name}'`);
  }
}
