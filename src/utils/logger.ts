import * as chalk from 'chalk';
import * as ProgressBar from 'progress';
import * as inquirer from 'inquirer';

inquirer.registerPrompt(
  'autocomplete',
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('inquirer-autocomplete-prompt'),
);

class Logger {
  private prefixLength = 8;

  public info(message: any): void {
    const prefix = chalk.blue(this.padPrefix('info'));
    console.log(this.prefixMessage(prefix, message));
  }

  public warn(message: any): void {
    const prefix = chalk.yellow(this.padPrefix('warn'));
    console.log(this.prefixMessage(prefix, message));
  }

  public error(message: any): void {
    const prefix = chalk.red(this.padPrefix('error'));
    console.log(this.prefixMessage(prefix, message));
  }

  public success(message: any): void {
    const prefix = chalk.green(this.padPrefix('success'));
    console.log(this.prefixMessage(prefix, message));
  }

  public progress(total: number = 100): ProgressBar {
    const prefix = chalk.cyan(this.padPrefix('progress'));

    return new ProgressBar(prefix + '[:bar] :percent', {
      complete: '=',
      incomplete: ' ',
      width: 50,
      total,
    });
  }

  public askBoolean(message: string, defaultValue: boolean = true): Promise<boolean> {
    return this.promptInquirer('confirm', {
      message,
      default: defaultValue,
    });
  }

  public askInput(message: string, defaultValue?: string): Promise<string> {
    return this.promptInquirer('input', {
      message,
      default: defaultValue,
      validate: (input: string) => {
        if (input.trim().length === 0) {
          return 'Input cannot be blank';
        }

        return true;
      },
    });
  }

  public askPassword(message: string): Promise<string> {
    return this.promptInquirer('password', {
      message,
      validate: (input: string) => {
        if (input.trim().length === 0) {
          return 'Password cannot be blank';
        }

        return true;
      },
    });
  }

  public askOption(message: string, options: string[], defaultOption?: string): Promise<string> {
    const defaultIndex = options.indexOf(defaultOption);

    return this.promptInquirer('list', {
      message,
      choices: options,
      default: defaultIndex > -1 ? defaultIndex : 0,
    });
  }

  public askAutocomplete(message: string, options: string[]): Promise<string> {
    return this.promptInquirer('autocomplete', {
      message,
      source: async (answersSoFar: string[], input: string) => {
        if (input === undefined) {
          return options;
        }

        input = input.toLowerCase();
        return options.filter(option => option.toLowerCase().includes(input));
      },
    });
  }

  private async promptInquirer(type: string, options: object): Promise<any> {
    const { answer } = await inquirer.prompt([
      {
        ...options,
        type,
        name: 'answer',
        prefix: chalk.magenta(this.padPrefix('input').trimRight()),
      },
    ]);

    return answer;
  }

  private padPrefix(prefix: string): string {
    return ' '.repeat(this.prefixLength - prefix.length) + prefix + ' ';
  }

  private prefixMessage(prefix: string, message: string): string {
    if (message === null) {
      message = 'null';
    }

    if (message === undefined) {
      message = 'undefined';
    }

    return message
      .toString()
      .split('\n')
      .map(line => prefix + line)
      .join('\n');
  }
}

export const logger = new Logger();
