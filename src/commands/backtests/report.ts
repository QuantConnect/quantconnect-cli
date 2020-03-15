import { BaseCommand } from '../../BaseCommand';
import { createBacktestFlag, createProjectFlag, parseBacktestFlag, parseProjectFlag } from '../../utils/command';

export default class DownloadBacktestReportCommand extends BaseCommand {
  public static description = 'download the report of a given backtest';

  public static flags = {
    ...BaseCommand.flags,
    ...createProjectFlag(),
    ...createBacktestFlag(),
  };

  protected async execute(): Promise<void> {
    const project = await parseProjectFlag(this.flags);
    const backtest = await parseBacktestFlag(project.projectId, this.flags);

    // TODO(jmerle): Implement
  }
}
