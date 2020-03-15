import { BaseCommand } from '../../BaseCommand';
import { createProjectFlag, selectProject } from '../../utils/command';

export default class RunBacktestCommand extends BaseCommand {
  public static description = 'run a backtest for a project';

  public static flags = {
    ...BaseCommand.flags,
    ...createProjectFlag(),
  };

  protected async execute(): Promise<void> {
    const project = await selectProject(this.flags);

    // TODO(jmerle): Implement
  }
}
