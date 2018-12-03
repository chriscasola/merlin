jest.mock('child_process');

import * as child_process from 'child_process';
import { exec } from './exec';

test('executes the command in a child process', async () => {
  let handler: any;
  (child_process.exec as any).mockImplementation(
    (command: string, options: child_process.ExecOptions, callback: any) => {
      expect(command).toBe('git clone blarg');
      expect(options).toEqual({
        cwd: 'cwd',
        windowsHide: true,
      });
      handler = callback;
    },
  );

  const resultPromise = exec('git clone blarg', 'cwd');
  if (process.platform === 'win32') {
    handler(undefined, ' "git results"\n');
  } else {
    handler(undefined, 'git results');
  }
  const result = await resultPromise;
  expect(result).toBe('git results');
});

test('handles a non-zero exit code from the child process', done => {
  let handler: any;
  (child_process.exec as any).mockImplementation(
    (command: string, options: child_process.ExecOptions, callback: any) => {
      handler = callback;
    },
  );

  exec('git clone blarg', 'cwd').catch(() => done());
  if (process.platform === 'win32') {
    handler('"git error"');
  } else {
    handler('git error');
  }
});
