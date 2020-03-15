import { BaseCommand } from '../../BaseCommand';

export default class DownloadBacktestReportCommand extends BaseCommand {
  public static description = 'download the report of a given backtest';

  public static flags = {
    ...BaseCommand.flags,
  };

  protected async execute(): Promise<void> {
    // TODO(jmerle): Implement
  }
}
