import highlight from 'cli-highlight';
import { BaseCommand } from '../../BaseCommand';
import { APIClient } from '../../api/APIClient';
import { formatExamples } from '../../utils/command';

export default class APIGetCommand extends BaseCommand {
  public static description = 'make an authenticated GET request to the QuantConnect API';

  public static examples = formatExamples([
    `$ qcli api:get authenticate
${highlight(`{
  "success": true
}`)}`,
  ]);

  public static flags = {
    ...BaseCommand.flags,
  };

  public static args = [
    {
      name: 'endpoint',
      description: 'API endpoint to send the request to',
      required: true,
    },
  ];

  protected async execute(): Promise<void> {
    const api = new APIClient();
    await api.projects.create('Test Project', 'C#');
    const { data } = await api.axios.get(this.args.endpoint);
    const json = JSON.stringify(data, null, 2);

    console.log(highlight(json, { language: 'json' }));
  }
}
