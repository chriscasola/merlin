import { exec } from '@merl/util';
import { join } from 'path';
import * as rimraf_ from 'rimraf';
import { promisify } from 'util';

const rimraf = promisify(rimraf_);

/**
 * Clears the bower_components directory and executes
 * `bower install` in the cwd.
 */
export async function bowerInstall(cwd: string) {
  await rimraf(join(cwd, '/bower_components/'), {
    disableGlob: true,
  });
  await exec('bower install', cwd);
}
