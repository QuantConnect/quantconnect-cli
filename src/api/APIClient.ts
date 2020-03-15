import * as crypto from 'crypto';
import axios from 'axios';
import { config } from '../utils/config';
import { FileClient } from './FileClient';
import { ProjectClient } from './ProjectClient';
import { CompileClient } from './CompileClient';
import { BacktestClient } from './BacktestClient';

export class APIClient {
  public axios = axios.create({
    baseURL: 'https://www.quantconnect.com/api/v2',
  });

  public files = new FileClient(this);
  public projects = new ProjectClient(this);
  public compiles = new CompileClient(this);
  public backtests = new BacktestClient(this);

  public constructor(userId: string = config.get('userId'), apiToken: string = config.get('apiToken')) {
    this.axios.interceptors.request.use(config => {
      const timestamp = Math.floor(new Date().getTime() / 1000);
      const hash = crypto
        .createHash('sha256')
        .update(`${apiToken}:${timestamp}`)
        .digest('hex');

      return {
        ...config,
        headers: {
          ...config.headers,
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

    try {
      const { status, data } = await this.axios.request(axiosConfig);

      if (status === 500) {
        throw this.createAuthenticationError();
      }

      if (status < 200 || status >= 300) {
        throw new Error(`${method} request to ${url} failed (status code ${status})`);
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

      throw new Error(`${method} request to ${url} failed (status code ${status})`);
    } catch (err) {
      if (err.isAxiosError) {
        throw new Error(`${method} request to ${url} failed (status code ${err.response.status})`);
      }

      throw err;
    }
  }

  private processData(obj: any): any {
    for (const key of Object.keys(obj)) {
      if (obj[key] !== null && typeof obj[key] === 'object') {
        this.processData(obj[key]);
      } else {
        if (key === 'modified' || key === 'created') {
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
