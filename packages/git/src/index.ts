import { exec } from '@merl/util';

const SHORTNAME_REGEX = /^\w+\/\w+$/i;

interface ICloneOptions {
  destination?: string;
  host?: string;
}

/**
 * Clones the given git repository into the given directory, within the given
 * working directory.
 */
export async function clone(
  repoName: string,
  cwd: string,
  { destination, host }: ICloneOptions = {},
) {
  if (repoName.match(SHORTNAME_REGEX) !== null) {
    host = host || 'github.com';
    repoName = `git@${host}:${repoName}.git`;
  }

  if (destination) {
    await exec(`git clone "${repoName}" "${destination}"`, cwd);
  } else {
    await exec(`git clone "${repoName}"`, cwd);
  }

  return undefined;
}

/**
 * Check out the given branch
 */
export async function checkout(branchName: string, cwd: string) {
  await exec(`git checkout ${branchName}`, cwd);
}

/**
 * Check out a new branch with the given name
 */
export async function checkoutNewBranch(branchName: string, cwd: string) {
  await exec(`git checkout -b ${branchName}`, cwd);
}

/**
 * Check if the given git working directory is clean
 */
export async function isCleanWorkingDirectory(cwd: string) {
  const result = await exec(`git status --porcelain`, cwd);
  return !!result.match(/^\s*$/);
}
