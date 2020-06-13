import { flags } from '@oclif/command';
import { BaseCommand } from '../../BaseCommand';
import { logger } from '../../utils/logger';

export default class UpdateBacktestCommand extends BaseCommand {
  public static description = 'change the name and/or the note of a given backtest';

  public static flags = {
    ...BaseCommand.flags,
    ...BaseCommand.createProjectFlag(),
    ...BaseCommand.createBacktestFlag(),
    name: flags.string({
      description: 'the new name to assign to the given backtest (default: current name)',
    }),
    note: flags.string({
      description: 'the new note to assign to the given backtest (default: current note)',
    }),
  };

  protected async execute(): Promise<void> {
    if (this.flags.name === undefined && this.flags.note === undefined) {
      throw new Error('--name and/or --note should be set');
    }

    const project = await this.parseProjectFlag();
    const backtest = await this.parseBacktestFlag(project.projectId);

    const name = this.flags.name || backtest.name;
    const note = this.flags.note || backtest.note || '';

    await this.api.backtests.update(project.projectId, backtest.backtestId, name, note);

    logger.info(`Successfully set name to '${name}' and note to '${note}'`);
  }
}
