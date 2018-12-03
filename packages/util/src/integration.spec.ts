import { exec } from './exec';

test('integration test for exec', async () => {
  const cwd = __dirname;
  const result = await exec(`echo "hello world"`, cwd);
  expect(result).toMatchInlineSnapshot(`"hello world"`);
});
