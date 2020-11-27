import { logger } from '../utils/logger';
import { BaseBrokerage } from './BaseBrokerage';

export class InteractiveBrokersBrokerage extends BaseBrokerage {
  public id = 'InteractiveBrokersBrokerage';
  public name = 'Interactive Brokers';

  public importantNotes = `
To use IB with QuantConnect you must set partial two-factor authentication.
This is done from your IB Account:
Manage Account > Security > Secure Login System > SLS Opt Out > select "I only want to use my Secure Login Device when logging into Account Management".
Your account details are not saved on QuantConnect.
  `.trim();

  public async getSettings(): Promise<any> {
    const username = await logger.askInput('Username');
    const accountId = await logger.askInput('Account ID');
    const accountPassword = await logger.askPassword('Account Password');

    let accountType: string = null;
    let environment: string = null;

    const demoSlice = accountId.toLowerCase().slice(0, 2);
    const liveSlice = accountId.toLowerCase().slice(0, 1);

    if (liveSlice === 'd') {
      switch (demoSlice) {
        case 'df':
        case 'du':
          accountType = 'individual';
          environment = 'paper';
          break;
        case 'di':
          accountType = 'advisor';
          environment = 'paper';
          break;
      }
    } else {
      switch (liveSlice) {
        case 'f':
        case 'i':
          accountType = 'advisor';
          environment = 'live';
          break;
        case 'u':
          accountType = 'individual';
          environment = 'live';
      }
    }

    if (environment === null) {
      throw new Error(`Account ID does not look like a valid account name`);
    }

    return {
      user: username,
      account: accountId,
      password: accountPassword,
      accountType,
      environment,
    };
  }

  public async getPriceDataHandler(): Promise<string> {
    const useIBFeed = await logger.askBoolean(
      'Do you want to use the Interactive Brokers price data feed instead of the QuantConnect price data feed?',
      false,
    );

    return useIBFeed ? 'InteractiveBrokersHandler' : 'QuantConnectHandler';
  }
}
