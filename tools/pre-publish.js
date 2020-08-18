const fs = require('fs');
const path = require('path');
const pkg = require('../package.json');

const { version } = pkg;
const mode = process.argv[2];

if (mode === 'blocklets-blocklet') {
  const file = path.join(__dirname, '../blocklets/blocklets-blocklet/package.json');
  const json = JSON.parse(fs.readFileSync(file).toString());
  json.version = version;
  fs.writeFileSync(file, JSON.stringify(json, null, 2));
  console.log('package.json for blocklets blocklet is created');
}
