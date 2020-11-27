import { flags } from '@oclif/command';
import { BaseCommand } from '../../BaseCommand';
import { logger } from '../../utils/logger';

export default class LiveLogCommand extends BaseCommand {
  public static description = 'display the logs of a live deployment';

  public static flags = {
    ...BaseCommand.flags,
    ...BaseCommand.createDeploymentFlag(),
    start: flags.integer({
      char: 's',
      description: 'show logs after a given timestamp',
      default: 0,
    }),
    end: flags.integer({
      char: 'e',
      description: 'show logs before a given timestamp',
      required: false,
    }),
  };

  protected async execute(): Promise<void> {
    const deployment = await this.parseDeploymentFlag();

    const logs = await this.api.live.getLogs(
      deployment.projectId,
      deployment.deployId,
      new Date(this.flags.start),
      new Date(this.flags.end),
    );

    logger.info(logs.trim().length > 0 ? logs : 'No logs found');
  }
}
