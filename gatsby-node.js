const fs = require('fs');
const path = require('path');
const axios = require('axios');
const uniq = require('lodash/uniq');
const pick = require('lodash/pick');
const sortBy = require('lodash/sortBy');
const github = require('octonode');
const { languages } = require('@arcblock/www/libs/locale');
const debug = require('debug')(require('./package.json').name);

const templates = {
  list: require.resolve('./src/templates/blocklet/list.js'),
  detail: require.resolve('./src/templates/blocklet/detail.js'),
};

const getNpmDownloadCount = async name => {
  try {
    const res = await axios.get(`https://api.npmjs.org/downloads/point/last-year/${name}`);
    return res.data.downloads;
  } catch (err) {
    return 0;
  }
};

const getGithubStats = repo => {
  const client = github.client();
  return new Promise(resolve => {
    client.get(`/repos/${repo}`, (err, status, body) => {
      if (err) {
        resolve({
          star: 1,
          watch: 1,
          fork: 0,
        });
      } else {
        resolve({
          start: body.stargazers_count,
          watch: body.watchers_count,
          fork: body.forks_count,
          created_at: body.created_at,
          updated_at: body.updated_at,
        });
      }
    });
  });
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
            gitRemote {
              id
              name
              full_name
              href
            }
            base
            publicURL
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
    console.log(node);
    if (node.base === 'blocklet.json') {
      const dir = path.dirname(node.absolutePath);
      blocklets[dir] = blocklets[dir] || {};
      blocklets[dir].dir = dir;
      blocklets[dir].main = node;
      blocklets[dir].gitUrl = node.gitRemote.href;
      blocklets[dir].repoName = node.gitRemote.full_name;
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
    if (
      node.absolutePath.includes('/screenshots/') &&
      node.internal.mediaType.startsWith('image/')
    ) {
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
        Object.assign(rawAttrs, JSON.parse(fs.readFileSync(npm.absolutePath).toString()));
      }
      if (main && fs.existsSync(main.absolutePath)) {
        Object.assign(rawAttrs, JSON.parse(fs.readFileSync(main.absolutePath).toString()));
      }

      const attrs = {
        name: true,
        description: true,
        group: true,
        gitUrl: true,
        provider: true,
        repoName: true,
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
        support: false,
        screenshots: false,
        tags: false,
      };

      const selectedAttrs = pick(rawAttrs, Object.keys(attrs));
      const requiredAttrs = Object.keys(attrs).filter(a => attrs[a]);

      // eslint-disable-next-line no-restricted-syntax
      for (const key of requiredAttrs) {
        if (!selectedAttrs[key]) {
          console.warn(
            `Blocklet ${rawAttrs.dir} not properly configured: missing required field ${key}`
          );
          return null;
        }
      }

      // TODO: detect duplicate blocklet names
      selectedAttrs.path = `/blocklet/${selectedAttrs.group}/${selectedAttrs.name}`;

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
      debug('downloadCount.done', { name: blocklet.name, downloads });
      blocklet.stats = { downloads };
    })
  );

  const repoNames = uniq(blocklets.map(x => x.repoName));
  await Promise.all(
    repoNames.map(async repoName => {
      const stats = await getGithubStats(repoName);
      debug('githubStats.done', { name: repoName, stats });
      blocklets.forEach(x => {
        if (x.repoName === repoName) {
          x.stats = Object.assign(x.stats || {}, stats);
        }
      });
    })
  );

  blocklets = sortBy(blocklets, x => x.stats.downloads).reverse();

  // 3. create blocklet list page
  actions.createPage({
    path: '/blocklets',
    component: templates.list,
    context: {
      language: 'en',
      originalPath: '/blocklets',
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
