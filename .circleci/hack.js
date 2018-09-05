const fs = require('fs');

// hack around `npm ci` bug
const cliPackage = JSON.parse(fs.readFileSync('./packages/cli/package.json'));
delete cliPackage.bin
fs.writeFileSync('./packages/cli/package.json', JSON.stringify(cliPackage, undefined, 2));
