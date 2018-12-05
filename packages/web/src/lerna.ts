import { spawn } from '@merl/util';
import { ChildProcess } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';

const readFile = util.promisify(fs.readFile);

/**
 * Run the given NPM script in the monorepo that is the current working directory.
 *
 * @param cwd the current working directory (should be a lerna-managed monorepo)
 * @param cmd the name of the NPM script to run in each package
 * @param packageName the name of the NPM package in the monorepo to which the command should be scoped
 */
export async function runScriptInMonorepo(
  cwd: string,
  cmd: string,
  packageName?: string,
  packageLocation?: string,
): Promise<ChildProcess> {
  const lernaPath = require.resolve('lerna/cli');

  if (packageLocation) {
    packageName = await getPackageNameFromPath(cwd, packageLocation);
  }

  let scopeCommand = '';
  if (packageName) {
    scopeCommand = `--scope ${packageName} --include-filtered-dependencies`;
  }

  return spawn(
    `node ${lernaPath} run --stream ${cmd} ${scopeCommand}`.trim(),
    cwd,
  );
}

async function getPackageNameFromPath(
  cwd: string,
  packageLocation: string,
): Promise<string> {
  const absPath = path.join(
    path.resolve(cwd, packageLocation),
    '/package.json',
  );
  const pkg = JSON.parse(await readFile(absPath, { encoding: 'utf8' }));
  return pkg.name;
}
