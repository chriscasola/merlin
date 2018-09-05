jest.mock('commander');

import * as program from 'commander';

test('initializes the CLI parser', () => {
  require('./cli');
  expect((program as any).parse).toHaveBeenCalledWith(process.argv);
});
