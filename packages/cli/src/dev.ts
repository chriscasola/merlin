import { checkout, checkoutNewBranch } from '@merl/git';
import { CommanderStatic } from 'commander';
import { installDeps } from './install-deps';
import { ICLIPlugin } from './plugin-api';

const cwd = process.cwd();

async function dev(newBranch: boolean, branchName: string) {
  if (newBranch) {
    checkoutNewBranch(branchName, cwd);
  } else {
    checkout(branchName, cwd);
  }

  await installDeps(false);
}

const cliPlugin: ICLIPlugin = {
  async install(cli: CommanderStatic) {
    cli
      .command('dev [branch]')
      .description('Checkout a branch and install dependencies.')
      .option('-c, --create', 'Create the branch')
      .action((branch, { create }) => {
        dev(!!create, branch);
      });
  },
};

module.exports = cliPlugin;
