import * as fs from 'fs';
import { BaseCommand } from '../BaseCommand';
import { config } from '../utils/config';
import { logger } from '../utils/logger';
import { APIClient } from '../api/APIClient';
import PullCommand from './sync/pull';

export default class InitCommand extends BaseCommand {
  public static description = 'create a new QuantConnect CLI project';

  public static flags = {
    ...BaseCommand.flags,
  };

  protected async execute(): Promise<void> {
    if (fs.readdirSync(process.cwd()).length > 0) {
      logger.error('Please run this command in an empty directory');
      process.exit(1);
    }

    const { userId, apiToken } = await this.askCredentials();

    config.createFile();
    config.set('userId', userId);
    config.set('apiToken', apiToken);

    logger.info('Successfully stored user ID and API token in quantconnect-cli.json');

    await PullCommand.run([]);
  }

  private async askCredentials(): Promise<{ userId: string; apiToken: string }> {
    logger.info('Your user ID and API token are needed to make authenticated requests to the QuantConnect API');
    logger.info('You can request these credentials on https://www.quantconnect.com/account');
    logger.info('Both will be saved in a file named quantconnect-cli.json in the current directory');

    while (true) {
      const userId = await logger.askInput('User ID');
      const apiToken = await logger.askPassword('API token');

      const api = new APIClient(userId, apiToken);
      const authenticated = await api.isAuthenticated();

      if (authenticated) {
        return { userId, apiToken };
      }

      logger.warn('Could not validate credentials, try again');
    }
  }
}
