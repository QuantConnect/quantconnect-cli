import { APIClient } from './APIClient';

export class NodeClient {
  public constructor(private api: APIClient) {}

  public async getAll(organizationId: string): Promise<QCNodeList> {
    return this.api.post('nodes/read', {
      organizationId,
    });
  }

  public async create(organizationId: string, name: string, sku: string): Promise<QCNode> {
    const data = await this.api.post('nodes/create', {
      organizationId,
      name,
      sku,
    });

    return data.node;
  }

  public async update(organizationId: string, nodeId: string, newName: string): Promise<void> {
    await this.api.post('nodes/update', {
      organizationId,
      nodeId,
      name: newName,
    });
  }

  public async delete(organizationId: string, nodeId: string): Promise<void> {
    await this.api.post('nodes/delete', {
      organizationId,
      nodeId,
    });
  }

  public async stop(organizationId: string, nodeId: string): Promise<void> {
    await this.api.post('nodes/stop', {
      organizationId,
      nodeId,
    });
  }
}
