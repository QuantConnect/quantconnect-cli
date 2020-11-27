import { BaseCommand } from '../../BaseCommand';
import { formatBrokerage, formatDate, formatLiveAlgorithmStatus } from '../../utils/format';
import { logger } from '../../utils/logger';

export default class LiveInfoCommand extends BaseCommand {
  public static description = 'display useful information about a live deployment';

  public static flags = {
    ...BaseCommand.flags,
    ...BaseCommand.createDeploymentFlag(),
  };

  protected async execute(): Promise<void> {
    const deployment = await this.parseDeploymentFlag();
    const project = await this.api.projects.get(deployment.projectId);

    logger.info(`Project id: ${deployment.projectId}`);
    logger.info(`Project name: ${project.name}`);
    logger.info(`Deployment id: ${deployment.deployId}`);
    logger.info(`Brokerage: ${formatBrokerage(deployment.brokerage)}`);
    logger.info(`Status: ${formatLiveAlgorithmStatus(deployment.status)}`);
    logger.info(`Launched: ${formatDate(deployment.launched)}`);
    logger.info(`Stopped: ${deployment.stopped ? formatDate(deployment.stopped) : 'N/A'}`);

    if (deployment.error) {
      logger.info('Error:');
      logger.info(deployment.error);
    } else {
      const base = deployment.stopped || new Date();
      const dayBeforeBase = new Date(base.getTime() - 24 * 60 * 60 * 1000);
      const logs = await this.api.live.getLogs(deployment.projectId, deployment.deployId, dayBeforeBase);

      logger.info('Logs of the last 24 hours:');
      logger.info(logs.length > 0 ? logs : 'No logs found');
    }
  }
}
