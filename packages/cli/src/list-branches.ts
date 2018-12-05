import { getRecentBranches } from '@merl/git';
import { CommanderStatic } from 'commander';
import { ICLIPlugin } from './plugin-api';

const cwd = process.cwd();

async function listBranches(numBranches: number) {
  const branches = await getRecentBranches(cwd, numBranches);
  branches.forEach(b => console.log(b));
}

const cliPlugin: ICLIPlugin = {
  async install(cli: CommanderStatic) {
    cli
      .command('list-branches')
      .description('Lists the git branches most recently committed to.')
      .option('-n, --num-branches', 'The number of branches to list', 5)
      .action(({ numBranches }) => {
        listBranches(numBranches);
      });
  },
};

module.exports = cliPlugin;
