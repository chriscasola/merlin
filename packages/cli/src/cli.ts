import { getConfig, IPluginConfig } from '@merl/util';
import * as program from 'commander';
import { ICLIPlugin } from './plugin-api';

const builtInCLI: ReadonlyArray<IPluginConfig> = Object.freeze([
  { name: './dev' },
  { name: './install-deps' },
  { name: './list-branches' },
  { name: './mono-run' },
]);

export default async function() {
  // built-in CLI commands
  let cliPlugins = builtInCLI;

  // plugin-based CLI commands
  const config = await getConfig();
  if (config.plugins) {
    cliPlugins = cliPlugins.concat(config.plugins);
  }

  // load each command
  const pluginPromise = Promise.all(
    cliPlugins.map(async plugin => {
      try {
        await (require(plugin.name) as ICLIPlugin).install(program);
      } catch (e) {
        console.error(`Unable to load "${plugin.name}" plugin!\n`, e);
      }
    }),
  );

  pluginPromise.then(() => program.parse(process.argv));
}
