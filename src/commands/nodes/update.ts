import { flags } from '@oclif/command';
import { BaseCommand } from '../../BaseCommand';
import { logger } from '../../utils/logger';

export class UpdateNodeCommand extends BaseCommand {
  public static description = 'update the name of a node';

  public static flags = {
    ...BaseCommand.flags,
    ...BaseCommand.createOrganizationFlag(),
    ...BaseCommand.createNodeFlag(),
    name: flags.string({
      description: 'new name for the node',
      required: true,
    }),
  };

  protected async execute(): Promise<void> {
    const organizationId = await this.parseOrganizationFlag();
    const node = await this.parseNodeFlag(organizationId);

    const oldName = node.name;
    const newName = this.flags.name;

    await this.api.nodes.update(organizationId, node.id, newName);

    logger.info(`Successfully changed node name from '${oldName}' to '${newName}'`);
  }
}
