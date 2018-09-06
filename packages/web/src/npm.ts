import { exec } from '@merl/util';
import * as fs from 'fs';
import { join } from 'path';
import * as rimraf_ from 'rimraf';
import { promisify } from 'util';

const rimraf = promisify(rimraf_);
const access = promisify(fs.access);

/**
 * Perform a fresh install of npm or yarn dependencies
 * in the given project directory. This function
 * automatically detects yarn or npm by the presence
 * of a lock file. A `lerna bootstrap` will also be
 * run if a `lerna.json` is detected.
 */
export async function npmInstall(cwd: string) {
  await rimraf(join(cwd, '/**/node_modules/'));

  const useLerna = await checkForFile('lerna.json', cwd);
  const useYarn = await checkForFile('yarn.lock', cwd);
  const hasPackageJson = await checkForFile('package.json', cwd);

  if (!hasPackageJson) {
    throw new Error('No package.json found');
  }

  await runNpmInstall(useYarn, cwd);

  if (useLerna) {
    await runLernaBootstrap(useYarn, cwd);
  }
}

async function runNpmInstall(useYarn: boolean, cwd: string) {
  if (useYarn) {
    await exec('yarn', cwd);
  } else {
    await exec('npm install', cwd);
  }
}

async function runLernaBootstrap(useYarn: boolean, cwd: string) {
  if (useYarn) {
    await exec('yarn lerna bootstrap', cwd);
  } else {
    await exec('npx lerna bootstrap', cwd);
  }
}

function checkForFile(file: string, cwd: string): Promise<boolean> {
  return access(join(cwd, file))
    .then(() => true)
    .catch(() => false);
}
