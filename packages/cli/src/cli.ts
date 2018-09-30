#!/usr/bin/env node

import * as program from 'commander';

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

program.parse(process.argv);

// tslint:disable-next-line:no-console
console.log('Welcome to Merlin!');
