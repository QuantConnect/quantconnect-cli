import { APIClient } from './APIClient';

export class BacktestClient {
  public constructor(private api: APIClient) {}

  public async get(projectId: number, backtestId: string): Promise<QCBacktest> {
    const data = await this.api.get('backtests/read', {
      projectId,
      backtestId,
    });

    return data.backtest;
  }

  public async getAll(projectId: number): Promise<QCBacktest[]> {
    const data = await this.api.get('backtests/read', { projectId });
    return data.backtests;
  }

  public async create(projectId: number, compileId: string, name: string): Promise<QCBacktest> {
    const data = await this.api.post('backtests/create', {
      projectId,
      compileId,
      backtestName: name,
    });

    return data.backtest;
  }

  public getReport(projectId: number, backtestId: string): Promise<QCBacktestReport> {
    return this.api.post('backtests/read/report', {
      projectId,
      backtestId,
    });
  }

  public async update(projectId: number, backtestId: string, name: string, note: string): Promise<void> {
    await this.api.post('backtests/update', {
      projectId,
      backtestId,
      name,
      note,
    });
  }

  public async delete(projectId: number, backtestId: string): Promise<void> {
    await this.api.post('backtests/delete', {
      projectId,
      backtestId,
    });
  }
}
