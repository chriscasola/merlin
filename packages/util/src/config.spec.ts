jest.mock('fs', () => require('memfs').fs);

import * as memfs from 'memfs';
import * as os from 'os';
import * as path from 'path';

import * as config from './config';

test('return empty config when no config files are present', async () => {
  expect(await config.readConfig()).toEqual({});
});

test('read user-level config', async () => {
  const userConfigPath = path.join(os.homedir(), '/.merl-config.json');
  memfs.vol.fromJSON({
    [userConfigPath]: `{
      "github": {
        "domain": "github.some-domain.com"
      }
    }`,
  });

  expect(await config.readConfig()).toMatchInlineSnapshot(`
Object {
  "github": Object {
    "domain": "github.some-domain.com",
  },
}
`);
});

test('read local config', async () => {
  memfs.vol.fromJSON({
    '/.merl-config.json': `{
      "github": {
        "domain": "github.some-domain.com"
      }
    }`,
  });

  expect(await config.readConfig()).toMatchInlineSnapshot(`
Object {
  "github": Object {
    "domain": "github.some-domain.com",
  },
}
`);
});

test('apply local config over user config', async () => {
  const userConfigPath = path.join(os.homedir(), '/.merl-config.json');
  memfs.vol.fromJSON({
    [userConfigPath]: `{
      "github": {
        "domain": "github.some-domain.com"
      },
      "npm": {
        "ignoreEngines": true
      }
    }`,
    '/.merl-config.json': `{
      "github": {
        "domain": "github.another-domain.com"
      }
    }`,
  });

  expect(await config.readConfig()).toMatchInlineSnapshot(`
Object {
  "github": Object {
    "domain": "github.another-domain.com",
  },
  "npm": Object {
    "ignoreEngines": true,
  },
}
`);
});

test('cache the config after first read', async () => {
  const firstVal = await config.getConfig();
  expect(firstVal).toMatchInlineSnapshot(`
Object {
  "github": Object {
    "domain": "github.another-domain.com",
  },
  "npm": Object {
    "ignoreEngines": true,
  },
}
`);
  expect(await config.getConfig()).toBe(firstVal);
});

test('throw an error when config file cannot be parsed', async () => {
  const userConfigPath = path.join(os.homedir(), '/.merl-config.json');
  memfs.vol.fromJSON({
    [userConfigPath]: `{
      "github": {
        "domain": "github.some-domain.com"
    }`,
  });

  await expect(config.readConfig()).rejects.toThrow(
    /Failed to parse configuration file!/,
  );

  memfs.vol.fromJSON({
    '/.merl-config.json': `{
      "github": {
        "domain": "github.some-domain.com"
    }`,
  });

  await expect(config.readConfig()).rejects.toThrow(
    /Failed to parse configuration file!/,
  );
});
