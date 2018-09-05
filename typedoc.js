module.exports = {
  "name": "Merlin",
  "mode": "modules",
  "exclude": [
    "**/packages/cli/**/*",
    "**/*.spec.ts"
  ],
  "out": "./docs",
  "external-modulemap": ".*packages\/([^\/]+)\/.*",
  "readme": "./README.md"
};
