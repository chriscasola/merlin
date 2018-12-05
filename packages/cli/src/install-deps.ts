import { bowerInstall, npmInstall } from '@merl/web';
import { CommanderStatic } from 'commander';
import { exists as exists_ } from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import { ICLIPlugin } from './plugin-api';

const exists = promisify(exists_);

const cwd = process.cwd();

export async function installDeps(clean: boolean) {
  await npmInstall(cwd, clean);

  const usesBower = await exists(path.join(cwd, '/bower.json'));
  if (usesBower) {
    await bowerInstall(cwd);
  }
}

const cliPlugin: ICLIPlugin = {
  async install(cli: CommanderStatic) {
    cli
      .command('install-deps')
      .description('Optionally clean and then install dependencies.')
      .option(
        '-c, --clean',
        'Clean previously installed dependencies before installing.',
      )
      .action(({ clean }) => {
        installDeps(!!clean);
      });
  },
};

module.exports = cliPlugin;
