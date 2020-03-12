require('dotenv').config();
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const pick = require('lodash/pick');
const sortBy = require('lodash/sortBy');
const { languages } = require('@arcblock/www/libs/locale');
const childProcess = require('child_process');
const debug = require('debug')(require('./package.json').name);

const { blocked } = require('./config');

const templates = {
  list: require.resolve('./src/templates/blocklet/list.js'),
  detail: require.resolve('./src/templates/blocklet/detail.js'),
};

const getNpmDownloadCount = async name => {
  try {
    const res = await axios.get(`https://api.npmjs.org/downloads/point/last-year/${name}`);
    return res.data.downloads;
  } catch (err) {
    return 1;
  }
};

const getNpmStats = async name => {
  try {
    const updatedAt = childProcess.execSync(`npm view ${name} time.modified`, { encoding: 'utf8' }) || '';
    return { updated_at: updatedAt.trim() };
  } catch (error) {
    return {};
  }
};

// Generate markdown pages
exports.createPages = async ({ actions, graphql }) => {
  const { data } = await graphql(`
    {
      allFile(filter: { sourceInstanceName: { ne: "" } }) {
        edges {
          node {
            id
            absolutePath
            relativePath
            internal {
              type
              mediaType
            }
            base
            publicURL
            npmMeta {
              repoName
              repoHref
            }
            childMarkdownRemark {
              htmlAst
            }
          }
        }
      }
    }
  `);
  const { edges } = data.allFile;

  // 1. group package.json and blocklet.json
  let blocklets = {};
  edges.forEach(({ node }) => {
    if (node.base === 'blocklet.json') {
      const dir = path.dirname(node.absolutePath);
      const config = require(node.absolutePath); // eslint-disable-line

      blocklets[dir] = blocklets[dir] || {};
      blocklets[dir].dir = dir;
      blocklets[dir].main = node;
      blocklets[dir].usages = config.usages || [];
      blocklets[dir].repoName = node.npmMeta.repoName;
      blocklets[dir].gitUrl = node.npmMeta.repoHref;
    }

    if (node.base === 'package.json') {
      const dir = path.dirname(node.absolutePath);

      blocklets[dir] = blocklets[dir] || {};
      blocklets[dir].npm = node;
    }

    // Append logo url
    if (node.base.startsWith('logo.') && node.internal.mediaType.startsWith('image/')) {
      const dir = path.dirname(node.absolutePath);
      blocklets[dir] = blocklets[dir] || {};
      blocklets[dir].logoUrl = node.publicURL;
    }

    // Aggregate screenshots
    if (node.absolutePath.includes('/screenshots/') && node.internal.mediaType.startsWith('image/')) {
      const dir = path.dirname(path.dirname(node.absolutePath));
      blocklets[dir] = blocklets[dir] || {};
      if (!Array.isArray(blocklets[dir].screenshots)) {
        blocklets[dir].screenshots = [];
      }
      blocklets[dir].screenshots.push(node.publicURL);
    }

    // Append readme
    if (
      node.base.endsWith('.md') &&
      node.internal.mediaType === 'text/markdown' &&
      node.childMarkdownRemark &&
      node.childMarkdownRemark.htmlAst
    ) {
      const dir = path.dirname(node.absolutePath);
      blocklets[dir] = blocklets[dir] || {};
      blocklets[dir].htmlAst = node.childMarkdownRemark.htmlAst;
    }
  });

  // 2. merge blocklet config
  blocklets = Object.keys(blocklets)
    .map(x => {
      const { main, npm } = blocklets[x];
      if (!main) {
        return null;
      }

      const rawAttrs = blocklets[x];
      rawAttrs.main = main ? main.absolutePath : null;
      rawAttrs.npm = npm ? npm.absolutePath : null;

      if (npm && fs.existsSync(npm.absolutePath)) {
        try {
          Object.assign(rawAttrs, JSON.parse(fs.readFileSync(npm.absolutePath).toString()));
        } catch (err) {
          console.error('Error parsing package.json', npm.absolutePath);
        }
      }
      if (main && fs.existsSync(main.absolutePath)) {
        try {
          Object.assign(rawAttrs, JSON.parse(fs.readFileSync(main.absolutePath).toString()));
        } catch (err) {
          console.error('Error parsing blocklet.json', main.absolutePath);
        }
      }

      const attrs = {
        name: true,
        description: true,
        group: true,
        gitUrl: false,
        provider: true,
        repoName: false,
        version: true,
        htmlAst: true,
        logoUrl: false,

        author: false,
        charging: false,
        color: false,
        community: false,
        dir: false,
        documentation: false,
        homepage: false,
        keywords: false,
        licence: false,
        npm: false,
        repository: false,
        requirements: false,
        support: false,
        screenshots: false,
        tags: false,
      };

      const selectedAttrs = pick(rawAttrs, Object.keys(attrs));
      const requiredAttrs = Object.keys(attrs).filter(a => attrs[a]);

      // eslint-disable-next-line no-restricted-syntax
      for (const key of requiredAttrs) {
        if (!selectedAttrs[key]) {
          console.warn(`Blocklet ${rawAttrs.dir} not properly configured: missing required field ${key}`);
          return null;
        }
      }

      // TODO: detect duplicate blocklet names
      selectedAttrs.path = `/${selectedAttrs.group}/${selectedAttrs.name}`;

      // Assign a color
      const colors = ['primary', 'secondary', 'error'];
      if (!selectedAttrs.color || !colors.includes(selectedAttrs.color)) {
        [selectedAttrs.color] = colors;
      }

      // Set charging to free if not specified
      if (!selectedAttrs.charging) {
        selectedAttrs.charging = { price: 0 };
      }

      return selectedAttrs;
    })
    .filter(Boolean);

  await Promise.all(
    blocklets.map(async blocklet => {
      const downloads = await getNpmDownloadCount(blocklet.name);
      const stats = await getNpmStats(blocklet.name);
      debug('downloadCount.done', { name: blocklet.name, downloads });
      blocklet.stats = { downloads, updated_at: stats.updated_at };
    })
  );

  blocklets = sortBy(blocklets, x => x.stats.downloads)
    .reverse()
    .filter(x => blocked.includes(x.name) === false);

  // Write blocklet list to json file
  if (process.env.NODE_ENV === 'production') {
    fs.writeFileSync(
      path.join(__dirname, './static/blocklets.json'),
      JSON.stringify(
        blocklets.map(x => {
          const tmp = Object.assign({}, x);
          delete tmp.htmlAst;
          return tmp;
        }),
        true,
        2
      )
    );
  }

  // 3. create blocklet list page
  actions.createPage({
    path: '/',
    component: templates.list,
    context: {
      language: 'en',
      originalPath: '/',
      locale: 'en',
      languages,
      blocklets,
    },
  });

  // 4. create blocklet detail page
  blocklets.forEach(x => {
    actions.createPage({
      path: x.path,
      component: templates.detail,
      context: {
        language: 'en',
        originalPath: x.path,
        locale: 'en',
        languages,
        blocklet: x,
      },
    });
  });
};
