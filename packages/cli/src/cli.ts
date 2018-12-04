import * as program from 'commander';
import dev from './dev';
import installDeps from './install-deps';
import listBranches from './list-branches';
import monoRun from './mono-run';

program
  .command('dev [branch]')
  .description('Checkout a branch and install dependencies.')
  .option('-c, --create', 'Create the branch')
  .action((branch, { create }) => {
    dev(!!create, branch);
  });

program
  .command('list-branches')
  .description('Lists the git branches most recently committed to.')
  .option('-n, --num-branches', 'The number of branches to list', 5)
  .action(({ numBranches }) => {
    listBranches(numBranches);
  });

program
  .command('install-deps')
  .description('Optionally clean and then install dependencies.')
  .option(
    '-c, --clean',
    'Clean previously installed dependencies before installing.',
  )
  .action(({ clean }) => {
    installDeps(!!clean);
  });

program
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

program.parse(process.argv);
