module.exports = {
  "name": "Merlin",
  "mode": "modules",
  "exclude": [
    "**/packages/cli/**/*",
    "**/*.spec.ts",
    "**/*.d.ts",
  ],
  "out": "./docs",
  "external-modulemap": ".*packages\/([^\/]+)\/.*",
  "readme": "./README.md",
};
