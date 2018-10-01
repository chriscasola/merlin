#!/usr/bin/env node

import * as program from 'commander';
import dev from './dev';
import installDeps from './install-deps';
import listBranches from './list-branches';

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
  .option('-n', '--num-branches', 5)
  .action(({ numBranches }) => {
    listBranches(numBranches);
  });

program
  .command('install-deps')
  .description('Optionally clean and then install dependencies.')
  .option(
    '-c',
    '--clean',
    'Clean previously installed dependencies before installing.',
  )
  .action(({ clean }) => {
    installDeps(!!clean);
  });

program.parse(process.argv);
