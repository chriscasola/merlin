jest.mock('../util/exec');

import { clone } from './';
import { exec } from '../util/exec';

test('clones a repo', async () => {
  await clone('something', 'cwd');
  expect(exec).toHaveBeenCalledTimes(1);
  expect(exec).toHaveBeenCalledWith('git clone something', 'cwd');
});
