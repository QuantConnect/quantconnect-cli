import { logger } from '../utils/logger';
import { BaseBrokerage } from './BaseBrokerage';

export class CoinbaseProBrokerage extends BaseBrokerage {
  public id = 'GDAXBrokerage';
  public name = 'Coinbase Pro';

  public importantNotes = `
You can generate Coinbase Pro API credentials on Coinbase Pro page.
When creating the key, make sure you authorize it for View and Trading access.
  `.trim();

  public async getSettings(): Promise<any> {
    const apiKey = await logger.askInput('API Key');
    const apiSecret = await logger.askInput('API Secret');
    const passphrase = await logger.askPassword('Passphrase');

    return {
      key: apiKey,
      secret: apiSecret,
      passphrase,
      environment: 'live',
    };
  }
}
