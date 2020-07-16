import { flags } from '@oclif/command';
import { BaseCommand } from '../../BaseCommand';
import { logger } from '../../utils/logger';

export class StopLiveCommand extends BaseCommand {
  public static description = 'stop live trading for a project';

  public static flags = {
    ...BaseCommand.flags,
    ...BaseCommand.createProjectFlag(),
    liquidate: flags.boolean({
      description: 'liquidate existing holdings (optional, defaults to false)',
      default: false,
    }),
  };

  protected async execute(): Promise<void> {
    const project = await this.parseProjectFlag();

    if (project.liveResults.eStatus !== 'Running') {
      throw new Error('Project is not running live');
    }

    const confirmationMessage = this.flags.liquidate
      ? 'Are you sure you want to liquidate existing holdings and stop live trading'
      : 'Are you sure you want to stop live trading';

    const confirmation = await logger.askBoolean(`${confirmationMessage} for project '${project.name}'?`, false);
    if (!confirmation) {
      return;
    }

    if (this.flags.liquidate) {
      await this.api.projects.liquidateAndStopLive(project.projectId);
    } else {
      await this.api.projects.stopLive(project.projectId);
    }

    const successMessage = this.flags.liquidate
      ? 'Successfully liquidated existing holdings and stopped live trading'
      : 'Successfully stopped live trading';

    logger.info(`${successMessage} for project '${project.name}'`);
  }
}
