import { getRecentBranches } from '@merl/git';

const cwd = process.cwd();

export default async function(numBranches: number) {
  const branches = await getRecentBranches(cwd, numBranches);
  // tslint:disable-next-line:no-console
  branches.forEach(b => console.log(b));
}
