import { clone } from './';

test('clones a repo', async () => {
  const result = await clone('something');
  expect(result).toBe('something');
});
