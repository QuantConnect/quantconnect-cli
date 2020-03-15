import highlight from 'cli-highlight';
import { flags } from '@oclif/command';
import { BaseCommand } from '../../BaseCommand';
import { APIClient } from '../../api/APIClient';
import { formatExamples } from '../../utils/command';

export default class APIPostCommand extends BaseCommand {
  public static description = 'make an authenticated POST request to the QuantConnect API';

  public static examples = formatExamples([
    `$ qcli api:post files/create --body '{ "projectId": 1234567, "name": "Empty.cs", "content": "// Empty file" }'
${highlight(`{
  "files": [
    {
      "id": 1234567,
      "uid": 12345,
      "pid": 1234567,
      "fpid": 0,
      "sname": "Empty.cs",
      "scontent": "// Empty file",
      "dtcreated": "2020-01-01 00:00:00",
      "dtmodified": "2020-01-01 00:00:00",
      "estatus": "Active",
      "etype": "File",
      "bopen": 0
    }
  ],
  "success": true
}`)}`,
  ]);

  public static flags = {
    ...BaseCommand.flags,
    body: flags.string({
      char: 'b',
      description: 'JSON string containing the data to use as body of the request',
    }),
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
    const { data } = await api.axios.post(this.args.endpoint, this.flags.body);
    const json = JSON.stringify(data, null, 2);

    console.log(highlight(json, { language: 'json' }));
  }
}
