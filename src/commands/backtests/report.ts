import * as fs from 'fs';
import * as path from 'path';
import * as open from 'open';
import { flags } from '@oclif/command';
import { BaseCommand } from '../../BaseCommand';
import { createBacktestFlag, createProjectFlag, parseBacktestFlag, parseProjectFlag } from '../../utils/command';
import { logger } from '../../utils/logger';
import { APIClient } from '../../api/APIClient';

export default class DownloadBacktestReportCommand extends BaseCommand {
  public static description = 'download the report of a given backtest';

  public static flags = {
    ...BaseCommand.flags,
    ...createProjectFlag(),
    ...createBacktestFlag(),
    path: flags.string({
      description: 'path to save report to (optional, backtest name is used if not specified)',
    }),
    overwrite: flags.boolean({
      description: 'overwrite the file if it already exists',
      default: false,
    }),
    open: flags.boolean({
      description: 'open the report in the browser when done',
      default: false,
    }),
  };

  protected async execute(): Promise<void> {
    const project = await parseProjectFlag(this.flags);
    const backtest = await parseBacktestFlag(project.projectId, this.flags);

    const outputPath = path.resolve(process.cwd(), this.flags.path || `${backtest.name}.html`);
    const fileExists = fs.existsSync(outputPath);

    if (fileExists && !this.flags.overwrite) {
      logger.error('Output file already exists, use --overwrite to overwrite');
      process.exit(1);
    }

    const api = new APIClient();
    let generationStarted = false;

    while (true) {
      try {
        const report = await api.backtests.getReport(project.projectId, backtest.backtestId);
        fs.writeFileSync(outputPath, report.report);
        break;
      } catch (err) {
        if (!generationStarted) {
          logger.info(`Started generating the report for backtest '${backtest.name}' for project '${project.name}'`);
          generationStarted = true;
        }
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    logger.info(`Saved report to ${outputPath}`);

    if (this.flags.open) {
      await open(`file://${outputPath}`);
    }
  }
}
