jest.mock('child_process');

import * as child_process from 'child_process';
import { exec } from './exec';

test('executes the command in a child process', async function() {
  let handler: any;
  (child_process.exec as any).mockImplementation(
    (command: string, options: child_process.ExecOptions, callback: any) => {
      expect(command).toBe('git clone blarg');
      expect(options).toEqual({
        windowsHide: true,
        cwd: 'cwd',
      });
      handler = callback;
    },
  );

  const resultPromise = exec('git clone blarg', 'cwd');
  handler(undefined, 'git results');
  const result = await resultPromise;
  expect(result).toBe('git results');
});
