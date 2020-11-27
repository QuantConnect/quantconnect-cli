import { flags } from '@oclif/command';
import { BaseCommand } from '../../BaseCommand';
import { formatAmount, formatBrokerage, formatDate, formatLiveAlgorithmStatus } from '../../utils/format';
import { logger } from '../../utils/logger';

export default class ListLiveCommand extends BaseCommand {
  public static description = 'list all live projects';

  public static flags = {
    ...BaseCommand.flags,
    status: flags.string({
      char: 's',
      description: 'only show live projects with a given status',
      options: ['running', 'runtime-error', 'stopped', 'liquidated'],
      required: false,
    }),
  };

  protected async execute(): Promise<void> {
    const status: QCLiveAlgorithmStatus = ({
      running: 'Running',
      'runtime-error': 'RuntimeError',
      stopped: 'Stopped',
      liquidated: 'Liquidated',
    } as Record<string, QCLiveAlgorithmStatus>)[this.flags.status];

    const projects = await this.api.live.getAll(status);
    logger.info(`Found ${formatAmount(projects.length, 'project')}`);

    if (projects.length === 0) {
      return;
    }

    const rows: any[][] = [['Project ID', 'Deploy ID', 'Brokerage', 'Status', 'Started', 'Stopped']];

    for (const project of projects) {
      rows.push([
        project.projectId,
        project.deployId,
        formatBrokerage(project.brokerage),
        formatLiveAlgorithmStatus(project.status),
        formatDate(project.launched),
        project.stopped ? formatDate(project.stopped) : 'N/A',
      ]);
    }

    logger.table(rows);
  }
}
