import { APIClient } from './APIClient';

export class ProjectClient {
  public constructor(private api: APIClient) {}

  public async get(projectId: number): Promise<QCProject> {
    const data = await this.api.get('projects/read', { projectId });
    return data.projects[0];
  }

  public async getAll(): Promise<QCProject[]> {
    const data = await this.api.get('projects/read');
    return data.projects;
  }

  public async create(name: string, language: QCLanguage): Promise<QCProject> {
    const data = await this.api.post('projects/create', {
      name,
      language,
    });

    return data.projects[0];
  }

  public delete(projectId: number): Promise<void> {
    return this.api.post('projects/delete', { projectId });
  }
}
