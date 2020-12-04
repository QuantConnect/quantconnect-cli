import * as chalk from 'chalk';
import * as inquirer from 'inquirer';
import * as ProgressBar from 'progress';
import { table } from 'table';
import { formatString } from './format';

inquirer.registerPrompt(
  'autocomplete',
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('inquirer-autocomplete-prompt'),
);

class Logger {
  private prefixLength = 5;
  private verbose = false;

  public debug(message: any): void {
    if (!this.verbose) {
      return;
    }

    const prefix = chalk.cyan(this.padPrefix('debug'));
    console.log(this.prefixMessage(prefix, message));
  }

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
    console.error(this.prefixMessage(prefix, message));
  }

  public progress(total: number = 100): ProgressBar {
    const prefix = this.padPrefix('');

    const bar = new ProgressBar(`${prefix}[:bar] :percent`, {
      complete: '=',
      incomplete: ' ',
      width: 50,
      total,
    });

    bar.update(0.0);
    return bar;
  }

  public table(rows: any[][]): void {
    const options = {
      drawHorizontalLine: (index: number, size: number): boolean => {
        return index === 0 || index === 1 || index === size;
      },
    };

    this.info(table(rows, options));
  }

  public askBoolean(message: string, defaultValue: boolean): Promise<boolean> {
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
          return 'Input cannot be blank';
        }

        return true;
      },
    });
  }

  public async askAutocomplete<T>(message: string, options: [option: T, label: string][]): Promise<T> {
    const labels = options.map(option => option[1]);

    const selectedLabel = await this.promptInquirer('autocomplete', {
      message,
      source: async (answersSoFar: string[], input: string) => {
        if (input === undefined) {
          return labels;
        }

        input = input.toLowerCase();
        return labels.filter(label => label.toLowerCase().includes(input));
      },
    });

    return options.find(option => option[1] === selectedLabel)[0];
  }

  public isVerbose(): boolean {
    return this.verbose;
  }

  public enableVerboseMessages(): void {
    this.verbose = true;
  }

  private async promptInquirer(type: string, options: any): Promise<any> {
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
    return formatString(message)
      .toString()
      .split('\n')
      .map(line => prefix + line)
      .join('\n');
  }
}

export const logger = new Logger();
