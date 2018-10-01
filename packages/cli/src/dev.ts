import { checkout, checkoutNewBranch } from '@merl/git';
import installDeps from './install-deps';

const cwd = process.cwd();

export default async function(newBranch: boolean, branchName: string) {
  if (newBranch) {
    checkoutNewBranch(branchName, cwd);
  } else {
    checkout(branchName, cwd);
  }

  await installDeps(false);
}
