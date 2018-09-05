import * as child_process from 'child_process';

/**
 * Executes the given command in the given working directory
 */
export function exec(command: string, cwd: string) {
  return new Promise((resolve, reject) => {
    const execOptions: child_process.ExecOptions = {
      windowsHide: true,
      cwd,
    };
    child_process.exec(command, execOptions, (err, stdout) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(stdout);
    });
  });
}
