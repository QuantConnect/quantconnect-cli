import { BaseCommand } from '../../BaseCommand';
import { logger } from '../../utils/logger';

export class DeleteBacktestCommand extends BaseCommand {
  public static description = 'delete a backtest';

  public static flags = {
    ...BaseCommand.flags,
    ...BaseCommand.createProjectFlag(),
    ...BaseCommand.createBacktestFlag(),
  };

  protected async execute(): Promise<void> {
    const project = await this.parseProjectFlag();
    const backtest = await this.parseBacktestFlag(project.projectId);

    const confirmation = await logger.askBoolean(`Are you sure you want to delete backtest '${backtest.name}'?`, false);
    if (!confirmation) {
      return;
    }

    await this.api.backtests.delete(project.projectId, backtest.backtestId);

    logger.info(`Successfully deleted backtest '${backtest.name}'`);
  }
}
