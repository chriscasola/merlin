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
