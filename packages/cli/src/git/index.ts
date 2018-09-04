import { exec } from '../util/exec';

export async function clone(repoName: string, cwd: string) {
  await exec(`git clone ${repoName}`, cwd);
  return undefined;
}
