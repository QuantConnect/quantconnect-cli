import highlight from 'cli-highlight';
import { BaseCommand } from '../../BaseCommand';

export default class APIGetCommand extends BaseCommand {
  public static description = 'make an authenticated GET request to the QuantConnect API';

  public static examples = BaseCommand.formatExamples([
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
    const { data } = await this.api.axios.get(this.args.endpoint);
    const json = JSON.stringify(data, null, 2);

    console.log(highlight(json, { language: 'json' }));
  }
}
