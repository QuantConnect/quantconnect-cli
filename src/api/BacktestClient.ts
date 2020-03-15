import { APIClient } from './APIClient';

export class BacktestClient {
  public constructor(private api: APIClient) {}

  public get(projectId: number, backtestId: string): Promise<QCBacktest> {
    return this.api.get('backtests/read', {
      projectId,
      backtestId,
    });
  }

  public async getAll(projectId: number): Promise<QCBacktest[]> {
    const data = await this.api.get('backtests/read', { projectId });
    return data.backtests;
  }

  public getReport(projectId: number, backtestId: string): Promise<QCBacktestReport> {
    return this.api.post('backtests/read/report', {
      projectId,
      backtestId,
    });
  }

  public update(projectId: number, backtestId: string, name: string, note: string): Promise<void> {
    return this.api.post('backtests/update', {
      projectId,
      backtestId,
      name,
      note,
    });
  }

  public delete(projectId: number, backtestId: string): Promise<void> {
    return this.api.post('backtests/delete', {
      projectId,
      backtestId,
    });
  }
}
