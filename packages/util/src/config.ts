import * as findUp from 'find-up';
import * as fs from 'fs';
import { defaultsDeep } from 'lodash';
import * as os from 'os';
import pMap from 'p-map';
import * as path from 'path';
import * as util from 'util';

const readFile = util.promisify(fs.readFile);

export interface IConfig {
  github?: {
    domain?: string;
  };
  npm?: {
    ignoreEngines?: boolean;
  };
}

let cachedConfig: IConfig;

/**
 * Returns the Merlin configuration. This function will read from
 * the ".merlin-config.json" in the user's home directory, if it
 * is present.
 *
 * It will also search up from the current working
 * directory. If a ".merlin-config.json" is found in that search
 * it will be considered a "project-local" config file and will
 * override the contents of the user-level config.
 */
export async function getConfig(): Promise<IConfig> {
  if (!cachedConfig) {
    cachedConfig = await readConfig();
  }

  return cachedConfig;
}

export async function readConfig(): Promise<IConfig> {
  const configsJson = await readConfigFiles();
  const configs: IConfig[] = await configsJson.map(
    ([configPath, configJson]) => {
      try {
        return JSON.parse(configJson);
      } catch (e) {
        throw new Error(
          `Failed to parse configuration file! (path=${configPath})`,
        );
      }
    },
  );

  return defaultsDeep({}, ...configs);
}

async function getConfigPaths(): Promise<string[]> {
  const userConfigPath = path.join(os.homedir(), '/.merl-config.json');
  let localConfigPath = await findUp('.merl-config.json');

  if (localConfigPath === userConfigPath) {
    localConfigPath = await findUp('.merl-config.json', {
      cwd: path.dirname(os.homedir()),
    });
  }

  return [localConfigPath, userConfigPath].filter(p => p != null) as string[];
}

async function readConfigFiles(): Promise<string[][]> {
  const configPaths = await getConfigPaths();
  return await pMap(
    configPaths,
    async (configPath: string): Promise<string[]> => {
      try {
        const configData: string = await readFile(configPath, {
          encoding: 'utf8',
        });
        return [configPath, configData];
      } catch (e) {
        // config file doesn't exist
        return [configPath, '{}'];
      }
    },
  );
}
