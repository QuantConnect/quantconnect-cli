import { logger } from '../utils/logger';
import { BaseBrokerage } from './BaseBrokerage';

export class AlpacaBrokerage extends BaseBrokerage {
  public id = 'AlpacaBrokerage';
  public name = 'Alpaca';

  public importantNotes = `
Create an API key by logging in and accessing the Bitfinex API Management page (https://www.bitfinex.com/api).
  `.trim();

  public async getSettings(): Promise<any> {
    const keyId = await logger.askInput('Key ID');
    const secretKey = await logger.askInput('Secret Key');

    const environment = await logger.askAutocomplete('Environment', [
      ['live', 'Live Trading'],
      ['paper', 'Paper Trading'],
    ]);

    return {
      key: keyId,
      secret: secretKey,
      environment,
    };
  }
}
