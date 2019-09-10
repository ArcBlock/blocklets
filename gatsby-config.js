const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const GitUrlParse = require('git-url-parse');

const filePath = path.resolve(__dirname, 'registry.yml');
const registry = yaml.safeLoad(fs.readFileSync(filePath));

const gitSources = [];
registry.forEach(({ repo }) => {
  const info = GitUrlParse(repo);
  gitSources.push({
    resolve: 'gatsby-source-git',
    options: {
      name: `${info.owner}/${info.name}`,
      remote: repo,
      // FIXME: we may specify a tag here
      branch: 'master',
      patterns: [
        '**/blocklet.json',
        '**/blocklet.md',
        '**/logo.{jpeg,jpg,png,gif,svg}',
        '**/screenshots/*.{jpeg,jpg,png,gif,svg}',
        '**/package.json',
      ],
    },
  });
});

module.exports = {
  plugins: gitSources.concat([
    {
      resolve: require.resolve('@arcblock/gatsby-theme-www'),
      options: {
        excludeI18n: () => true,
        excludeMd: ({ fileAbsolutePath }) => fileAbsolutePath.endsWith('/blocklet.md'),
      },
    },
    {
      resolve: 'gatsby-plugin-netlify-cache',
      options: {
        cachePublic: true,
      },
    },
  ]),
};
