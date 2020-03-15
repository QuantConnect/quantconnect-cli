import { APIClient } from './APIClient';

export class FileClient {
  public constructor(private api: APIClient) {}

  public async get(projectId: number, filename: string): Promise<QCFile> {
    const data = await this.api.get('files/read', {
      projectId,
      name: filename,
    });

    return data.files[0];
  }

  public async getAll(projectId: number): Promise<QCFile[]> {
    const data = await this.api.get('files/read', { projectId });
    return data.files;
  }

  public create(projectId: number, filename: string, content: string): Promise<void> {
    return this.api.post('files/create', {
      projectId,
      name: filename,
      content,
    });
  }

  public rename(projectId: number, oldFilename: string, newFilename: string): Promise<void> {
    return this.api.post('files/create', {
      projectId,
      name: oldFilename,
      newName: newFilename,
    });
  }

  public update(projectId: number, filename: string, content: string): Promise<void> {
    return this.api.post('files/update', {
      projectId,
      name: filename,
      content,
    });
  }

  public delete(projectId: number, filename: string): Promise<void> {
    return this.api.post('files/delete', {
      projectId,
      name: filename,
    });
  }
}
