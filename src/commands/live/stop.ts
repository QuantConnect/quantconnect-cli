import { BaseCommand } from '../../BaseCommand';
import { logger } from '../../utils/logger';

export class StopLiveCommand extends BaseCommand {
  public static description = 'stop live trading for a project';

  public static flags = {
    ...BaseCommand.flags,
    ...BaseCommand.createProjectFlag(),
  };

  protected async execute(): Promise<void> {
    const project = await this.parseProjectFlag(p => p.liveResults.eStatus === 'Running');

    if (project.liveResults.eStatus !== 'Running') {
      throw new Error('Project is not running live');
    }

    const confirmation = await logger.askBoolean(
      `Are you sure you want to stop live trading for project '${project.name}'?`,
      false,
    );

    if (!confirmation) {
      return;
    }

    await this.api.projects.stopLive(project.projectId);

    logger.info(`Successfully liquidated and stopped live trading for project '${project.name}'`);
  }
}
