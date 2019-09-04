const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const GitUrlParse = require('git-url-parse');

const filePath = path.resolve(__dirname, 'registry.yml');
const registry = yaml.safeLoad(fs.readFileSync(filePath));

const gitSources = [];
registry.forEach(({ repo, blocklets = [] }) => {
  const info = GitUrlParse(repo);
  gitSources.push({
    resolve: 'gatsby-source-git',
    options: {
      name: `${info.owner}/${info.name}`,
      remote: repo,
      // FIXME: we may specify a tag here
      branch: 'master',
      patterns: ['**/blocklet/*.*', '**/package.json'],
    },
  });
});

module.exports = {
  plugins: gitSources.concat([
    {
      resolve: require.resolve('@arcblock/gatsby-theme-www'),
      options: {
        pagesPath: [path.resolve(__dirname, './src/pages')],
        excludeI18n: () => true,
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
