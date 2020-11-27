import { logger } from '../utils/logger';
import { BaseBrokerage } from './BaseBrokerage';

export class BitfinexBrokerage extends BaseBrokerage {
  public id = 'BitfinexBrokerage';
  public name = 'Bitfinex';

  public importantNotes = `
Create an API key by logging in and accessing the Bitfinex API Management page (https://www.bitfinex.com/api).
  `.trim();

  public async getSettings(): Promise<any> {
    const keyId = await logger.askInput('Key ID');
    const secretKey = await logger.askInput('Secret Key');

    return {
      key: keyId,
      secret: secretKey,
      environment: 'live',
    };
  }
}
