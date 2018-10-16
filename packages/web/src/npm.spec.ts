jest.mock('fs', () => require('memfs').fs);
jest.mock('@merl/util');

import { exec } from '@merl/util';
import * as memfs from 'memfs';
import { npmInstall } from './npm';

afterEach(() => {
  memfs.vol.reset();
});

describe('npmInstall', () => {
  test('delete existing node_modules directory if it exists', async () => {
    memfs.vol.fromJSON({
      '/proj/test/package.json': '{"name":"some-package"}',
    });
    await npmInstall('/proj/test/', true);
    expect(memfs.vol.toJSON()).toMatchInlineSnapshot(`
Object {
  "/proj/test/package.json": "{\\"name\\":\\"some-package\\"}",
}
`);

    memfs.vol.fromJSON({
      '/proj/test/node_modules/some_package/readme.md': 'readme',
    });
    await npmInstall('/proj/test/', true);
    expect(memfs.vol.toJSON()).toMatchInlineSnapshot(`
Object {
  "/proj/test/package.json": "{\\"name\\":\\"some-package\\"}",
}
`);
  });

  test('skip clean if requested', async () => {
    memfs.vol.fromJSON({
      '/proj/test/package.json': '{"name":"some-package"}',
    });
    await npmInstall('/proj/test/');
    expect(memfs.vol.toJSON()).toMatchInlineSnapshot(`
Object {
  "/proj/test/package.json": "{\\"name\\":\\"some-package\\"}",
}
`);
  });

  test('delete nested node_modules directories', async () => {
    memfs.vol.fromJSON({
      '/proj/test/node_modules/some_package/readme.md': 'readme',
      '/proj/test/package.json': `{"name":"some-package"}`,
      '/proj/test/packages/sub-package/node_modules/some_dep/readme.md':
        'readme',
      '/proj/test/packages/sub-package/readme.md': 'readme',
    });
    await npmInstall('/proj/test/', true);
    expect(memfs.vol.toJSON()).toMatchInlineSnapshot(`
Object {
  "/proj/test/package.json": "{\\"name\\":\\"some-package\\"}",
  "/proj/test/packages/sub-package/readme.md": "readme",
}
`);
  });

  test('fail to install deps when package.json not present', async () => {
    memfs.vol.fromJSON({
      '/proj/test/readme.md': 'readme',
    });

    expect(memfs.vol.toJSON()).toMatchInlineSnapshot(`
Object {
  "/proj/test/readme.md": "readme",
}
`);
    await expect(
      npmInstall('/proj/test/', true),
    ).rejects.toThrowErrorMatchingInlineSnapshot(`"No package.json found"`);
  });

  test('use yarn if there is a yarn.lock present', async () => {
    memfs.vol.fromJSON({
      '/proj/test/package.json': `{"name":"some-package"}`,
      '/proj/test/yarn.lock': 'lockfile',
    });
    await npmInstall('/proj/test/', true);
    expect(exec).toHaveBeenCalledTimes(1);
    expect(exec).toHaveBeenCalledWith(
      'yarn --ignore-engines --network-timeout 30000000',
      '/proj/test/',
    );
  });

  test('use npm if there is a package.json present', async () => {
    memfs.vol.fromJSON({
      '/proj/test/package.json': `{"name":"some-package"}`,
    });
    await npmInstall('/proj/test/', true);
    expect(exec).toHaveBeenCalledTimes(1);
    expect(exec).toHaveBeenCalledWith('npm install', '/proj/test/');
  });

  test('bootstrap lerna if there is a lerna.json present', async () => {
    memfs.vol.fromJSON({
      '/proj/test/lerna.json': `{"lerna":"config"}`,
      '/proj/test/package.json': `{"name":"some-package"}`,
    });
    await npmInstall('/proj/test/', true);
    expect(exec).toHaveBeenCalledTimes(2);
    expect(exec).toHaveBeenNthCalledWith(1, 'npm install', '/proj/test/');
    expect(exec).toHaveBeenNthCalledWith(
      2,
      'npx lerna bootstrap',
      '/proj/test/',
    );

    memfs.vol.reset();
    memfs.vol.fromJSON({
      '/proj/test/lerna.json': `{"lerna":"config"}`,
      '/proj/test/package.json': `{"name":"some-package"}`,
      '/proj/test/yarn.lock': 'lockfile',
    });
    await npmInstall('/proj/test/', true);
    expect(exec).toHaveBeenCalledTimes(4);
    expect(exec).toHaveBeenNthCalledWith(
      3,
      'yarn --ignore-engines --network-timeout 30000000',
      '/proj/test/',
    );
    expect(exec).toHaveBeenNthCalledWith(
      4,
      'yarn lerna bootstrap',
      '/proj/test/',
    );
  });
});
