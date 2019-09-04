const fs = require('fs');
const path = require('path');
const mkdir = require('mkdirp');
const remark = require('remark');
const include = require('@arcblock/remark-include');
const parse = require('remark-parse');
const stringify = require('remark-stringify');
const frontmatter = require('remark-frontmatter');
const debug = require('debug')('www');

function stripFrontmatter(ast) {
  const { children, file } = ast;
  if (Array.isArray(children) && children.length && ['yaml', 'toml'].includes(children[0].type)) {
    debug('PreProcessingDocs: stripFrontmatter', { child: children[0].type, file });
    children.shift();
  }

  return ast;
}

function processFile(sourcePath, targetPath) {
  if (!fs.existsSync(sourcePath)) {
    throw new Error('merge markdown error: source file not found');
  }

  const source = fs.readFileSync(sourcePath);

  const parser = remark()
    .use(parse)
    .use(stringify)
    .use(frontmatter, ['yaml', 'toml'])
    .use(include, {
      cwd: path.dirname(sourcePath),
      onInclude: stripFrontmatter,
    });

  const result = parser.processSync(source.toString());

  debug('PreProcessingDocs: processFile', { sourcePath, targetPath });
  mkdir.sync(path.dirname(targetPath));

  fs.writeFileSync(targetPath, result);
}

const cwd = process.cwd();

processFile(
  path.resolve(`${cwd}/dependencies/Whitepaper/src/content/latest/index.md`),
  path.resolve(`${cwd}/src/pages/generated/whitepaper/index.md`)
);

processFile(
  path.resolve(`${cwd}/dependencies/Whitepaper/src/content/latest/index.ch.md`),
  path.resolve(`${cwd}/src/pages/generated/whitepaper/index.ch.md`)
);
