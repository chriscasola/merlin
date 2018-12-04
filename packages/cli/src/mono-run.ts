import { runScriptInMonorepo } from '@merl/web';

const cwd = process.cwd();

export default async function(
  command: string,
  target?: string,
  packageLocation?: string,
) {
  const runProcess = await runScriptInMonorepo(
    cwd,
    command,
    target,
    packageLocation,
  );

  runProcess.stdout.pipe(process.stdout);
  runProcess.stderr.pipe(process.stderr);
}
