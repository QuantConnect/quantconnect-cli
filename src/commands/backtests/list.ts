import { BaseCommand } from '../../BaseCommand';
import { createProjectFlag, parseProjectFlag } from '../../utils/command';
import { APIClient } from '../../api/APIClient';
import { logger } from '../../utils/logger';
import { formatAmount, formatDate } from '../../utils/format';

export default class ListBacktestsCommand extends BaseCommand {
  public static description = 'list all backtest ran for a project';

  public static flags = {
    ...BaseCommand.flags,
    ...createProjectFlag(),
  };

  protected async execute(): Promise<void> {
    const project = await parseProjectFlag(this.flags);

    const api = new APIClient();
    const backtests = await api.backtests.getAll(project.projectId);

    logger.info(`Found ${formatAmount('backtest', backtests.length)}`);

    if (backtests.length === 0) {
      return;
    }

    const rows: any[][] = [['ID', 'Name', 'Status', 'Requested']];

    for (const backtest of backtests) {
      let status: string;

      if (backtest.completed) {
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
