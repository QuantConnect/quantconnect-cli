import { BaseBrokerage } from './BaseBrokerage';

export class PaperTradingBrokerage extends BaseBrokerage {
  public id = 'QuantConnectBrokerage';
  public name = 'Paper Trading';

  public async getSettings(): Promise<any> {
    return {
      environment: 'paper',
    };
  }
}
