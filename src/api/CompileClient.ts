import { APIClient } from './APIClient';

export class CompileClient {
  public constructor(private api: APIClient) {}

  public get(projectId: number, compileId: string): Promise<QCCompile> {
    return this.api.get('compile/read', {
      projectId,
      compileId,
    });
  }

  public create(projectId: number): Promise<QCCompile> {
    return this.api.post('compile/create', { projectId });
  }
}
