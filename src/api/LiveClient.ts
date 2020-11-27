import { toUnixTimestamp } from '../utils/format';
import { APIClient } from './APIClient';

export class LiveClient {
  public constructor(private api: APIClient) {}

  public async getAll(status?: QCLiveAlgorithmStatus, start?: Date, end?: Date): Promise<QCLiveAlgorithm[]> {
    const parameters: any = {
      start: start ? toUnixTimestamp(start) : 0,
      end: end ? toUnixTimestamp(end) : toUnixTimestamp(new Date()),
    };

    if (status !== undefined) {
      parameters.status = status;
    }

    const data = await this.api.get('live/read', parameters);
    return data.live;
  }

  public async stop(projectId: number): Promise<void> {
    await this.api.post('live/update/stop', { projectId });
  }

  public async liquidateAndStop(projectId: number): Promise<void> {
    await this.api.post('live/update/liquidate', { projectId });
  }
}
