import { toUnixTimestamp } from '../utils/format';
import { APIClient } from './APIClient';

export class LiveClient {
  public constructor(private api: APIClient) {}

  public async getAll(
    status?: QCLiveAlgorithmStatus,
    start: Date = new Date(0),
    end: Date = new Date(),
  ): Promise<QCLiveAlgorithm[]> {
    const parameters: any = {
      start: toUnixTimestamp(start),
      end: toUnixTimestamp(end),
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

    return this.api.post('live/create', parameters);
  }

  public async stop(projectId: number): Promise<void> {
    await this.api.post('live/update/stop', { projectId });
  }

  public async liquidateAndStop(projectId: number): Promise<void> {
    await this.api.post('live/update/liquidate', { projectId });
  }

  public async getLogs(
    projectId: number,
    deploymentId: string,
    start: Date = new Date(0),
    end: Date = new Date(),
  ): Promise<string> {
    const { data } = await this.api.axios.post('live/read/log', {
      projectId,
      algorithmId: deploymentId,
      start: toUnixTimestamp(start),
      end: toUnixTimestamp(end),
    });

    return data;
  }
}
