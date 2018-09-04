// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  globals: {
    'ts-jest': {
      tsConfigFile: 'tsconfig.json',
    },
  },
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  testEnvironment: 'node',
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(tsx?)$',
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
};
