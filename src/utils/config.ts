import * as path from 'path';
import * as fs from 'fs-extra';

interface ConfigFile {
  userId: string;
  apiToken: string;
  projectIndex: { [name: string]: number };
}

class Config {
  private cache: ConfigFile = null;

  private defaults: Partial<ConfigFile> = {
    projectIndex: {},
  };

  public constructor(private configFilePath: string) {}

  public get<T extends keyof ConfigFile>(key: T): ConfigFile[T] {
    this.loadCacheIfNecessary();

    if (key in this.cache) {
      return this.cache[key];
    }

    if (key in this.defaults) {
      return this.defaults[key] as any;
    }

    throw new Error(`There is no default value for config item with key '${key}'`);
  }

  public set<T extends keyof ConfigFile>(key: T, value: ConfigFile[T]): void {
    this.loadCacheIfNecessary();

    this.cache[key] = value;

    const fileContent = JSON.stringify(this.cache, null, 2) + '\n';
    fs.writeFileSync(this.configFilePath, fileContent);
  }

  public fileExists(): boolean {
    return fs.existsSync(this.configFilePath);
  }

  public createFile(): void {
    fs.writeFileSync(this.configFilePath, '{}\n');
  }

  private loadCacheIfNecessary(): void {
    if (this.cache === null) {
      this.cache = JSON.parse(fs.readFileSync(this.configFilePath).toString());
    }
  }
}

export const config = new Config(path.resolve(process.cwd(), 'quantconnect-cli.json'));
