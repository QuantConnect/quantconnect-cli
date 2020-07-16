import { flags } from '@oclif/command';
import { BaseCommand } from '../../BaseCommand';
import { logger } from '../../utils/logger';

export default class CreateNodeCommand extends BaseCommand {
  public static description = 'create a new node and add it to an organization';

  public static flags = {
    ...BaseCommand.flags,
    ...BaseCommand.createOrganizationFlag(),
    name: flags.string({
      description: 'the name of the node',
      required: true,
    }),
    sku: flags.string({
      description: 'the SKU of the node as visible in the dropdowns on the pricing page alongside the node counters',
      required: true,
    }),
  };

  protected async execute(): Promise<void> {
    const organizationId = await this.parseOrganizationFlag();

    const node = await this.api.nodes.create(organizationId, this.flags.name, this.flags.sku);

    logger.info(`Successfully created node '${node.name}'`);
  }
}
