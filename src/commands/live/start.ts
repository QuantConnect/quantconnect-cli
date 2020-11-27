import { BaseCommand } from '../../BaseCommand';
import { brokerages } from '../../brokerages';
import { compileProject } from '../../utils/api';
import { logger } from '../../utils/logger';

export class StartLiveCommand extends BaseCommand {
  public static description = 'start live trading for a project';

  public static flags = {
    ...BaseCommand.flags,
    ...BaseCommand.createProjectFlag(),
    ...BaseCommand.createNodeFlag(),
  };

  protected async execute(): Promise<void> {
    const project = await this.parseProjectFlag();

    if (project.liveResults.eStatus === 'Running') {
      throw new Error('Project is already running live');
    }

    const compile = await compileProject(this.api, project);

    const brokerage = await logger.askAutocomplete(
      'Select a brokerage',
      brokerages.map(brokerage => [brokerage, brokerage.name]),
    );

    if (brokerage.importantNotes !== null) {
      logger.info(brokerage.importantNotes);
    }

    const brokerageSettings = await brokerage.getSettings();
    brokerageSettings.id = brokerage.id;

    const priceDataHandler = await brokerage.getPriceDataHandler();

    const tiingoConfirmation = await logger.askBoolean('Do you want to use the Tiingo News data feed?', false);
    const tiingoToken = tiingoConfirmation ? await logger.askInput(`Tiingo token`) : undefined;

    const node = await this.parseNodeFlag(project.organizationId, 'live');

    const liveConfirmation = await logger.askBoolean(
      `Are you sure you want to start live trading for project '${project.name}'?`,
      false,
    );

    if (!liveConfirmation) {
      return;
    }

    await this.api.live.start(
      project.projectId,
      compile.compileId,
      node.id,
      brokerageSettings,
      priceDataHandler,
      tiingoToken,
    );

    logger.info(`Successfully started live trading for project '${project.name}'`);
  }
}
