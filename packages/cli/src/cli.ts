#!/usr/bin/env node

import * as program from 'commander';
import dev from './dev';
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

program.parse(process.argv);
