import { runScriptInMonorepo } from '@merl/web';
import { CommanderStatic } from 'commander';
import { ICLIPlugin } from './plugin-api';

const cwd = process.cwd();

async function monoRun(
  command: string,
  target?: string,
  packageLocation?: string,
) {
  const runProcess = await runScriptInMonorepo(
    cwd,
    command,
    target,
    packageLocation,
  );

  runProcess.stdout.pipe(process.stdout);
  runProcess.stderr.pipe(process.stderr);
}

const cliPlugin: ICLIPlugin = {
  async install(cli: CommanderStatic) {
    cli
      .command('mono-run [command]')
      .description('Run a NPM script in a monorepo using lerna')
      .option(
        '-t, --target [package-name]',
        'The name of a package to which the scope should be limited.',
      )
      .option(
        '-p, --package-location [package-location]',
        'The location of a package to which the scope should be limited.',
      )
      .action((command, { target, packageLocation }) => {
        monoRun(command, target, packageLocation);
      });
  },
};

module.exports = cliPlugin;
