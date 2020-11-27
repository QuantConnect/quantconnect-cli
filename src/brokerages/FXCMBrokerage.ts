import { logger } from '../utils/logger';
import { BaseBrokerage } from './BaseBrokerage';

export class FXCMBrokerage extends BaseBrokerage {
  public id = 'FxcmBrokerage';
  public name = 'FXCM';

  public importantNotes = `
Your account details are not saved on QuantConnect.

By default FXCM does not enable API access.

To request API access, please send an email to pcs@fxcm.com titled "Please enable Java API for my account" containing the following body:
Hello FXCM staff,

Please enable Java API for all accounts which are associated with this email address.

Also, please respond to this email address once Java API has been enabled, letting me know that the change was done successfully.

Thank you very much in advance
  `.trim();

  public async getSettings(): Promise<any> {
    const username = await logger.askInput('Username');
    const password = await logger.askPassword('Account Password');

    const environment = await logger.askAutocomplete('Environment', [
      ['paper', 'Demo'],
      ['live', 'Real'],
    ]);

    const accountId = await logger.askInput('Account ID');

    return {
      account: accountId,
      user: username,
      password,
      environment,
    };
  }
}
