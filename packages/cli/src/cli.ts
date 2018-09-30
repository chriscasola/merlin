#!/usr/bin/env node

import * as program from 'commander';
import listBranches from './list-branches';

program
  .command('dev [branch]')
  .description('Checkout a branch and install dependencies.')
  .option('-c, --create', 'Create the branch')
  .action((branch, { create }) => {
    // tslint:disable-next-line:no-console
    console.log(
      `Getting ready to develop on ${branch}. Creating branch first: ${create}`,
    );
  });

program
  .command('list-branches')
  .description('Lists the git branches most recently committed to.')
  .option('-n', '--num-branches', 5)
  .action(({ numBranches }) => {
    listBranches(numBranches);
  });

program.parse(process.argv);
