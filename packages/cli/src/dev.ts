import { checkout, checkoutNewBranch } from '@merl/git';
import { bowerInstall, npmInstall } from '@merl/web';
import { exists as exists_ } from 'fs';
import * as path from 'path';
import { promisify } from 'util';

const exists = promisify(exists_);

const cwd = process.cwd();

export default async function(newBranch: boolean, branchName: string) {
  if (newBranch) {
    checkoutNewBranch(branchName, cwd);
  } else {
    checkout(branchName, cwd);
  }

  await npmInstall(cwd);

  const usesBower = await exists(path.join(cwd, '/bower.json'));
  if (usesBower) {
    await bowerInstall(cwd);
  }
}
