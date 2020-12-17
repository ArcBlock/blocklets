const fs = require('fs');
const os = require('os');
const path = require('path');
const yaml = require('js-yaml');

const filePath = path.resolve(__dirname, 'registry.yml');
const registry = yaml.safeLoad(fs.readFileSync(filePath));

const npmSources = registry.map(({ name }) => ({
  resolve: require.resolve('gatsby-source-npmjs'),
  options: {
    name,
    cache: true,
    // cacheDir: os.tmpdir(),
    patterns: [
      '**/blocklet.yml',
      '**/blocklet.yaml',
      '**/blocklet.json',
      '**/blocklet.md',
      '**/logo.{jpeg,jpg,png,gif,svg}',
      '**/screenshots/*.{jpeg,jpg,png,gif,svg}',
      '**/package.json',
    ],
  },
}));

module.exports = {
  plugins: npmSources.concat([
    {
      resolve: require.resolve('@arcblock/www'),
    },
    {
      resolve: require.resolve('@arcblock/gatsby-theme-www'),
      options: {
        showGetStarted: true,
        defaultBanner: '/og-banner.png',
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
