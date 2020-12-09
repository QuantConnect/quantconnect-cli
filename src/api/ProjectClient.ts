import { config } from '../utils/config';
import { formatProjectName } from '../utils/format';
import { APIClient } from './APIClient';

export class ProjectClient {
  public constructor(private api: APIClient) {}

  public async get(projectId: number): Promise<QCProject> {
    const data = await this.api.get('projects/read', { projectId });
    const project: QCProject = data.projects[0];

    if (config.get('hideBootCampProjects') && project.name.startsWith('Boot Camp/')) {
      throw new Error('Boot Camp projects are ignored');
    }

    return this.processProject(project);
  }

  public async getAll(): Promise<QCProject[]> {
    const data = await this.api.get('projects/read');
    const projects = (data.projects as QCProject[]).map(project => this.processProject(project));

    if (config.get('hideBootCampProjects')) {
      return projects.filter(project => !project.name.startsWith('Boot Camp/'));
    }

    return projects;
  }

  public async create(name: string, language: QCLanguage): Promise<QCProject> {
    const data = await this.api.post('projects/create', {
      name,
      language,
    });

    return this.processProject(data.projects[0]);
  }

  public async delete(projectId: number): Promise<void> {
    await this.api.post('projects/delete', { projectId });
  }

  private processProject(project: QCProject): QCProject {
    project.name = formatProjectName(project.name);
    return project;
  }
}
