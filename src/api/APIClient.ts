import * as crypto from 'crypto';
import * as querystring from 'querystring';
import axios, { AxiosResponse } from 'axios';
import { logger } from '../utils/logger';
import { toUnixTimestamp } from '../utils/format';
import { FileClient } from './FileClient';
import { ProjectClient } from './ProjectClient';
import { CompileClient } from './CompileClient';
import { BacktestClient } from './BacktestClient';
import { NodeClient } from './NodeClient';
import { LiveClient } from './LiveClient';

export class APIClient {
  public axios = axios.create({
    baseURL: 'https://www.quantconnect.com/api/v2',
    maxBodyLength: 1_000_000_000,
    maxContentLength: 1_000_000_000,
  });

  public files = new FileClient(this);
  public projects = new ProjectClient(this);
  public compiles = new CompileClient(this);
  public backtests = new BacktestClient(this);
  public nodes = new NodeClient(this);
  public live = new LiveClient(this);

  public constructor(userId: string, apiToken: string) {
    this.axios.interceptors.request.use(config => {
      if (logger.isVerbose()) {
        const method = config.method.toUpperCase();
        const url = config.baseURL + '/' + config.url;
        let destination = method + ' ' + url;

        if (config.params !== undefined) {
          const query = querystring.stringify(config.params);
          if (query.length > 0) {
            destination += '?' + query;
          }
        }

        const data = config.data;
        if (data !== undefined) {
          logger.debug(`${destination} - ${JSON.stringify(data)}`);
        } else {
          logger.debug(destination);
        }
      }

      const timestamp = toUnixTimestamp(new Date());
      const hash = crypto.createHash('sha256').update(`${apiToken}:${timestamp}`).digest('hex');

      return {
        ...config,
        headers: {
          ...config.headers,

          // eslint-disable-next-line @typescript-eslint/naming-convention
          Timestamp: timestamp,
        },
        auth: {
          username: userId,
          password: hash,
        },
        maxContentLength: 1e9,
      };
    });
  }

  public async isAuthenticated(): Promise<boolean> {
    try {
      await this.get('projects/read');
      return true;
    } catch (err) {
      return false;
    }
  }

  public get(endpoint: string, parameters: any = {}): Promise<any> {
    return this.request('GET', endpoint, { params: parameters });
  }

  public post(endpoint: string, data: any = {}): Promise<any> {
    return this.request('POST', endpoint, { data });
  }

  private async request(method: string, endpoint: string, requestOptions: any = {}): Promise<any> {
    const axiosConfig = {
      ...requestOptions,
      method,
      url: endpoint,
    };

    const url = this.axios.getUri(axiosConfig);
    let response: AxiosResponse;

    try {
      response = await this.axios.request(axiosConfig);
    } catch (err) {
      const { status, statusText } = err.response;
      throw new Error(`${method} request to ${url} failed (${status} ${statusText})`);
    }

    const { status, statusText, data } = response;

    if (status === 500) {
      throw this.createAuthenticationError();
    }

    if (status < 200 || status >= 300) {
      throw new Error(`${method} request to ${url} failed (${status} ${statusText})`);
    }

    if (data.success) {
      return this.processData(data);
    }

    if (data.errors !== undefined && data.errors.length > 0) {
      if (data.errors[0].startsWith("Hash doesn't match.")) {
        throw this.createAuthenticationError();
      }

      throw new Error(data.errors.join('\n'));
    }

    if (data.messages !== undefined && data.messages.length > 0) {
      throw new Error(data.messages.join('\n'));
    }

    throw new Error(`${method} request to ${url} failed (${status} ${statusText})`);
  }

  private processData(obj: any): any {
    for (const key of Object.keys(obj)) {
      if (obj[key] === null) {
        continue;
      }

      if (typeof obj[key] === 'object') {
        this.processData(obj[key]);
      } else {
        if (key === 'modified' || key === 'created' || key === 'launched' || key === 'stopped') {
          obj[key] = new Date(Date.parse(obj[key] + ' UTC'));
        }
      }
    }

    return obj;
  }

  private createAuthenticationError(): Error {
    return new Error(
      'Invalid credentials, please make sure the user ID and the API token in quantconnect-cli.json are valid',
    );
  }
}
