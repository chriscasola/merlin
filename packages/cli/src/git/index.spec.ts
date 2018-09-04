jest.mock('../util/exec');

import { clone } from './';
import { exec } from '../util/exec';

test('clones a repo', async () => {
  await clone('git@github.com:chriscasola/merlin.git', 'cwd');
  expect(exec).toHaveBeenCalledTimes(1);
  expect(exec).toHaveBeenCalledWith(
    'git clone "git@github.com:chriscasola/merlin.git"',
    'cwd',
  );

  await clone('https://github.com/chriscasola/merlin.git', 'cwd');
  expect(exec).toHaveBeenCalledTimes(2);
  expect(exec).toHaveBeenCalledWith(
    'git clone "https://github.com/chriscasola/merlin.git"',
    'cwd',
  );
});

test('clones a repo using the short name', async function() {
  await clone('chriscasola/merlin', 'cwd');
  expect(exec).toHaveBeenCalledTimes(1);
  expect(exec).toHaveBeenCalledWith(
    'git clone "git@github.com:chriscasola/merlin.git"',
    'cwd',
  );
});

test('clones a repo into an alternate directory', async function() {
  await clone('chriscasola/merlin', 'cwd', { destination: 'merlin2' });
  expect(exec).toHaveBeenCalledTimes(1);
  expect(exec).toHaveBeenCalledWith(
    'git clone "git@github.com:chriscasola/merlin.git" "merlin2"',
    'cwd',
  );
});

test('clones a repo using a short name and alternate host', async function() {
  await clone('chriscasola/merlin', 'cwd', {
    destination: 'merlin2',
    host: 'github.mycompany.com',
  });
  expect(exec).toHaveBeenCalledTimes(1);
  expect(exec).toHaveBeenCalledWith(
    'git clone "git@github.mycompany.com:chriscasola/merlin.git" "merlin2"',
    'cwd',
  );
});
