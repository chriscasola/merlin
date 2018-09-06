jest.mock('fs', () => require('memfs').fs);
jest.mock('@merl/util');

import { exec } from '@merl/util';
import * as memfs from 'memfs';
import { bowerInstall } from './bower';

describe('bowerInstall', () => {
  test('delete existing bower_components directory', async () => {
    memfs.vol.fromJSON({
      '/proj/test/bower_components/some_file.txt': 'some test data',
      '/proj/test/readme.md': 'readme',
    });

    await bowerInstall('/proj/test/');
    expect(memfs.vol.toJSON()).toMatchInlineSnapshot(`
Object {
  "/proj/test/readme.md": "readme",
}
`);
  });

  test('install latest bower components', async () => {
    await bowerInstall('/proj/test/');
    expect(exec).toHaveBeenCalledTimes(1);
    expect(exec).toHaveBeenCalledWith('bower install', '/proj/test/');
  });
});
