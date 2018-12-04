import { getRecentBranches } from '@merl/git';

const cwd = process.cwd();

export default async function(numBranches: number) {
  const branches = await getRecentBranches(cwd, numBranches);
  branches.forEach(b => console.log(b));
}
