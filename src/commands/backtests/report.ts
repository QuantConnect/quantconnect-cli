import * as path from 'path';
import { flags } from '@oclif/command';
import * as fs from 'fs-extra';
import * as open from 'open';
import { BaseCommand } from '../../BaseCommand';
import { logger } from '../../utils/logger';
import { sleep } from '../../utils/promises';

export default class DownloadBacktestReportCommand extends BaseCommand {
  public static description = 'download the report of a given backtest';

  public static flags = {
    ...BaseCommand.flags,
    ...BaseCommand.createProjectFlag(),
    ...BaseCommand.createBacktestFlag(),
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
    const project = await this.parseProjectFlag();
    const backtest = await this.parseBacktestFlag(project.projectId);

    const outputPath = path.resolve(process.cwd(), this.flags.path || `${backtest.name}.html`);
    const fileExists = fs.existsSync(outputPath);

    if (fileExists && !this.flags.overwrite) {
      throw new Error('Output file already exists, use --overwrite to overwrite');
    }

    let generationStarted = false;

    while (true) {
      try {
        const report = await this.api.backtests.getReport(project.projectId, backtest.backtestId);

        if (!report.report.includes('html')) {
          continue;
        }

        fs.writeFileSync(outputPath, report.report);
        break;
      } catch (err) {
        if (!generationStarted) {
          logger.info(`Started generating the report for backtest '${backtest.name}' for project '${project.name}'`);
          generationStarted = true;
        }
      }

      await sleep(1000);
    }

    logger.info(`Saved report to ${outputPath}`);

    if (this.flags.open) {
      await open(`file://${outputPath}`);
    }
  }
}
