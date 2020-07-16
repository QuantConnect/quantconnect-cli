import { BaseCommand } from '../../BaseCommand';
import { logger } from '../../utils/logger';

export class StopNodeCommand extends BaseCommand {
  public static description = 'stop a node';

  public static flags = {
    ...BaseCommand.flags,
    ...BaseCommand.createOrganizationFlag(),
    ...BaseCommand.createNodeFlag(),
  };

  protected async execute(): Promise<void> {
    const organizationId = await this.parseOrganizationFlag();
    const node = await this.parseNodeFlag(organizationId);

    if (!node.busy) {
      throw new Error('Node is not in use');
    }

    await this.api.nodes.stop(organizationId, node.id);

    logger.info(`Successfully stopped node '${node.name}'`);
  }
}
