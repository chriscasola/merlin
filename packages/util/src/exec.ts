import * as child_process from 'child_process';

/**
 * Executes the given command in the given working directory
 */
export function exec(command: string, cwd: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const execOptions: child_process.ExecOptions = {
      cwd,
      windowsHide: true,
    };
    child_process.exec(command, execOptions, (err, stdout) => {
      if (err) {
        reject(err);
        return;
      }

      stdout = stdout.trim();

      /* istanbul ignore next */
      if (process.platform === 'win32') {
        stdout = stdout.slice(1, -1);
      }

      resolve(stdout);
    });
  });
}
