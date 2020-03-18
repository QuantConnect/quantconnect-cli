import { BaseCommand } from '../../BaseCommand';
import { logger } from '../../utils/logger';
import { formatAmount, formatDate } from '../../utils/format';
import { isBacktestComplete } from '../../utils/backtests';

export default class ListBacktestsCommand extends BaseCommand {
  public static description = 'list all backtest for a project';

  public static flags = {
    ...BaseCommand.flags,
    ...BaseCommand.createProjectFlag(),
  };

  protected async execute(): Promise<void> {
    const project = await this.parseProjectFlag();

    const backtests = await this.api.backtests.getAll(project.projectId);
    logger.info(`Found ${formatAmount('backtest', backtests.length)}`);

    if (backtests.length === 0) {
      return;
    }

    const rows: any[][] = [['ID', 'Name', 'Status', 'Requested']];

    for (const backtest of backtests) {
      let status: string;

      if (isBacktestComplete(backtest)) {
        if (backtest.error === null) {
          status = 'Successful';
        } else {
          status = 'Runtime Error';
        }
      } else {
        status = 'Running';
      }

      rows.push([backtest.backtestId, backtest.name, status, formatDate(backtest.created)]);
    }

    logger.table(rows);
  }
}
