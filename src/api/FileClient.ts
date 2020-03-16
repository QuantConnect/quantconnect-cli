import { APIClient } from './APIClient';

export class FileClient {
  public constructor(private api: APIClient) {}

  public async get(projectId: number, fileName: string): Promise<QCFile> {
    const data = await this.api.get('files/read', {
      projectId,
      name: fileName,
    });

    return data.files[0];
  }

  public async getAll(projectId: number): Promise<QCFile[]> {
    const data = await this.api.get('files/read', { projectId });
    return data.files;
  }

  public async create(projectId: number, fileName: string, content: string): Promise<QCFile> {
    const data = await this.api.post('files/create', {
      projectId,
      name: fileName,
      content,
    });

    return data.files[0];
  }

  public async rename(projectId: number, oldFileName: string, newFileName: string): Promise<void> {
    await this.api.post('files/create', {
      projectId,
      name: oldFileName,
      newName: newFileName,
    });
  }

  public async update(projectId: number, fileName: string, content: string): Promise<void> {
    await this.api.post('files/update', {
      projectId,
      name: fileName,
      content,
    });
  }

  public async delete(projectId: number, fileName: string): Promise<void> {
    await this.api.post('files/delete', {
      projectId,
      name: fileName,
    });
  }
}
