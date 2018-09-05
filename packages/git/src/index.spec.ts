jest.mock('@merl/util');

import { exec } from '@merl/util';
import {
  checkout,
  checkoutNewBranch,
  clone,
  isCleanWorkingDirectory,
} from './';

test('clones a repo', async () => {
  (exec as jest.Mock).mockImplementation(() => Promise.resolve());

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

test('clones a repo using the short name', async () => {
  (exec as jest.Mock).mockImplementation(() => Promise.resolve());

  await clone('chriscasola/merlin', 'cwd');
  expect(exec).toHaveBeenCalledTimes(1);
  expect(exec).toHaveBeenCalledWith(
    'git clone "git@github.com:chriscasola/merlin.git"',
    'cwd',
  );
});

test('clones a repo into an alternate directory', async () => {
  (exec as jest.Mock).mockImplementation(() => Promise.resolve());

  await clone('chriscasola/merlin', 'cwd', { destination: 'merlin2' });
  expect(exec).toHaveBeenCalledTimes(1);
  expect(exec).toHaveBeenCalledWith(
    'git clone "git@github.com:chriscasola/merlin.git" "merlin2"',
    'cwd',
  );
});

test('clones a repo using a short name and alternate host', async () => {
  (exec as jest.Mock).mockImplementation(() => Promise.resolve());

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

test('check out a branch', async () => {
  (exec as jest.Mock).mockImplementation(() => Promise.resolve());

  await checkout('feat/my-branch', 'cwd');
  expect(exec).toHaveBeenCalledTimes(1);
  expect(exec).toHaveBeenCalledWith('git checkout feat/my-branch', 'cwd');
});

test('check out a new branch', async () => {
  (exec as jest.Mock).mockImplementation(() => Promise.resolve());

  await checkoutNewBranch('feat/my-branch', 'cwd');
  expect(exec).toHaveBeenCalledTimes(1);
  expect(exec).toHaveBeenCalledWith('git checkout -b feat/my-branch', 'cwd');
});

test('check for clean working directory', async () => {
  (exec as jest.Mock).mockImplementation(() => Promise.resolve('M bla'));

  const isClean = await isCleanWorkingDirectory('cwd');
  expect(exec).toHaveBeenCalledTimes(1);
  expect(exec).toHaveBeenCalledWith('git status --porcelain', 'cwd');
  expect(isClean).toBe(false);

  (exec as jest.Mock).mockImplementation(() => Promise.resolve(''));
  expect(await isCleanWorkingDirectory('cwd')).toBe(true);

  (exec as jest.Mock).mockImplementation(() => Promise.resolve(' \n '));
  expect(await isCleanWorkingDirectory('cwd')).toBe(true);
});
