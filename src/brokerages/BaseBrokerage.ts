export abstract class BaseBrokerage {
  public abstract id: string;
  public abstract name: string;

  public importantNotes: string = null;

  public abstract getSettings(): Promise<any>;

  public async getPriceDataHandler(): Promise<string> {
    return 'QuantConnectHandler';
  }
}
