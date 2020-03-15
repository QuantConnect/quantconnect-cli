import { BaseCommand } from '../../BaseCommand';
import { createProjectFlag, selectProject } from '../../utils/command';

export default class ListBacktestsCommand extends BaseCommand {
  public static description = 'list all backtest ran for a project';

  public static flags = {
    ...BaseCommand.flags,
    ...createProjectFlag(),
  };

  protected async execute(): Promise<void> {
    const project = await selectProject(this.flags);

    // TODO(jmerle): Implement
  }
}
