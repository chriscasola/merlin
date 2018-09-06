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

  let useLerna = false;
  let useYarn = false;

  try {
    await access(join(cwd, '/yarn.lock'), fs.constants.F_OK);
    useYarn = true;
  } catch (e) {
    // nothing to do
  }

  try {
    await access(join(cwd, '/lerna.json'), fs.constants.F_OK);
    useLerna = true;
  } catch (e) {
    // nothing to do
  }

  await access(join(cwd, '/package.json'), fs.constants.F_OK);

  if (useYarn) {
    await exec('yarn', cwd);
  } else {
    await exec('npm install', cwd);
  }

  if (useLerna) {
    if (useYarn) {
      await exec('yarn lerna bootstrap', cwd);
    } else {
      await exec('npx lerna bootstrap', cwd);
    }
  }
}
