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

  public async start(
    projectId: number,
    compileId: string,
    nodeId: string,
    brokerageSettings: any,
    priceDataHandler: string,
    tiingoToken?: string,
  ): Promise<QCLiveAlgorithm> {
    const parameters: any = {
      projectId,
      compileId,
      nodeId,
      brokerage: brokerageSettings,
      dataHandler: priceDataHandler,
      versionId: '-1',
    };

    if (tiingoToken !== undefined) {
      parameters.addOnDataFeed = {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        TiingoNews: {
          token: tiingoToken,
        },
      };
    }

    return await this.api.post('live/create', parameters);
  }

  public async stop(projectId: number): Promise<void> {
    await this.api.post('live/update/stop', { projectId });
  }

  public async liquidateAndStop(projectId: number): Promise<void> {
    await this.api.post('live/update/liquidate', { projectId });
  }
}
