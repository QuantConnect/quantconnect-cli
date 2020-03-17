import { config } from '../utils/config';
import { APIClient } from './APIClient';

export class ProjectClient {
  public constructor(private api: APIClient) {}

  public async get(projectId: number): Promise<QCProject> {
    const data = await this.api.get('projects/read', { projectId });
    const project: QCProject = data.projects[0];

    if (config.get('hideBootCampProjects') && project.name.startsWith('Boot Camp/')) {
      throw new Error('Boot Camp projects are ignored');
    }

    return project;
  }

  public async getAll(): Promise<QCProject[]> {
    const data = await this.api.get('projects/read');
    const projects: QCProject[] = data.projects;

    if (!config.get('hideBootCampProjects')) {
      return projects;
    }

    return projects.filter(project => !project.name.startsWith('Boot Camp/'));
  }

  public async create(name: string, language: QCLanguage): Promise<QCProject> {
    const data = await this.api.post('projects/create', {
      name,
      language,
    });

    return data.projects[0];
  }

  public async delete(projectId: number): Promise<void> {
    await this.api.post('projects/delete', { projectId });
  }
}
