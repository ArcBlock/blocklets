const path = require('path');

module.exports = {
  plugins: [
    {
      resolve: require.resolve('@arcblock/gatsby-theme-www'),
      options: {
        pagesPath: [path.resolve(__dirname, './src/pages')],
      },
    },
    {
      resolve: 'gatsby-plugin-netlify-cache',
      options: {
        cachePublic: true,
      },
    },
  ],
};
