jest.mock('fs', () => require('memfs').fs);
jest.mock('@merl/util');

import { spawn } from '@merl/util';
import * as memfs from 'memfs';
import { runScriptInMonorepo } from './lerna';

beforeEach(() => {
  memfs.vol.reset();
});

const cwd = process.cwd();

test('build package with npm', async () => {
  await runScriptInMonorepo(cwd, 'build', 'my-package');
  expect(spawn).toHaveBeenCalledTimes(1);
  expect((spawn as any).mock.calls[0][0]).toMatch(
    /^node \S+lerna\/cli.js run --stream build --scope my-package --include-filtered-dependencies$/gi,
  );
  expect((spawn as any).mock.calls[0][1]).toBe(cwd);

  await runScriptInMonorepo(cwd, 'build-it', 'my-package');
  expect(spawn).toHaveBeenCalledTimes(2);
  expect((spawn as any).mock.calls[1][0]).toMatch(
    /^node \S+lerna\/cli.js run --stream build-it --scope my-package --include-filtered-dependencies$/gi,
  );
  expect((spawn as any).mock.calls[1][1]).toBe(cwd);
});

test('build package with path', async () => {
  memfs.vol.fromJSON({
    [cwd+'/proj/test/package.json']: `{
      "name": "my-test-package"
    }`,
  });

  await runScriptInMonorepo(cwd, 'build', undefined, './proj/test/');
  expect(spawn).toHaveBeenCalledTimes(1);
  expect((spawn as any).mock.calls[0][0]).toMatch(
    /^node \S+lerna\/cli.js run --stream build --scope my-test-package --include-filtered-dependencies$/gi,
  );
  expect((spawn as any).mock.calls[0][1]).toBe(cwd);
});

test('run script across whole repo', async () => {
  await runScriptInMonorepo(cwd, 'build');
  expect(spawn).toHaveBeenCalledTimes(1);
  expect((spawn as any).mock.calls[0][0]).toMatch(
    /^node \S+lerna\/cli.js run --stream build$/gi,
  );
  expect((spawn as any).mock.calls[0][1]).toBe(cwd);
});
