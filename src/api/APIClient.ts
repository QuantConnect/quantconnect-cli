import * as crypto from 'crypto';
import axios from 'axios';
import { config } from '../utils/config';

export class APIClient {
  public axios = axios.create({
    baseURL: 'https://www.quantconnect.com/api/v2',
  });

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

  public get(endpoint: string): Promise<any> {
    return this.request('GET', endpoint);
  }

  public post(endpoint: string, data: any = {}): Promise<any> {
    return this.request('POST', endpoint, { data });
  }

  private async request(method: string, endpoint: string, requestOptions: any = {}): Promise<any> {
    try {
      const { status, data } = await this.axios.request({
        ...requestOptions,
        method,
        url: endpoint,
      });

      if (status === 500) {
        throw this.createAuthenticationError();
      }

      if (status < 200 || status >= 300) {
        throw new Error(`${method} request failed (status code ${status})`);
      }

      if (data.success) {
        return data;
      }

      if (data.errors !== undefined && data.errors.length > 0) {
        const error = data.errors[0];

        if (error.startsWith("Hash doesn't match.")) {
          throw this.createAuthenticationError();
        }

        throw new Error(error);
      }

      if (data.messages !== undefined && data.messages.length > 0) {
        throw new Error(data.messages[0]);
      }

      return data;
    } catch (err) {
      if (err.isAxiosError) {
        throw new Error(`${method} request failed (status code ${err.response.status})`);
      }

      throw err;
    }
  }

  private createAuthenticationError(): Error {
    return new Error(
      'Invalid credentials, please make sure the user ID and the API token in quantconnect-cli.json are valid.',
    );
  }
}
