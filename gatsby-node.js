require('dotenv').config();
const childProcess = require('child_process');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const sortBy = require('lodash/sortBy');
const uniqBy = require('lodash/uniqBy');
const { types } = require('@arcblock/mcrypto');
const { toHex } = require('@arcblock/forge-util');
const { fromPublicKey } = require('@arcblock/did');
const { languages } = require('@arcblock/www/src/libs/locale');
const { readBlockletConfig } = require('@abtnode/util');
const debug = require('debug')(require('./package.json').name);

const { blocked } = require('./config');

const toBlockletDid = name => {
  const pk = toHex(name);
  return fromPublicKey(pk, { role: types.RoleType.ROLE_ANY });
};

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

const getNpmInfo = async name => {
  try {
    const viewStr = childProcess.execSync(`npm view ${name} --json`, { encoding: 'utf8' }) || '';
    const view = JSON.parse(viewStr);
    const { dist = {} } = view;
    const { modified } = view.time;
    return {
      stats: {
        updated_at: modified.trim(),
      },
      dist,
    };
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
      blocklets[dir].blockletJson = node;
      blocklets[dir].repoName = node.npmMeta.repoName;
      blocklets[dir].gitUrl = node.npmMeta.repoHref;
      blocklets[dir].usages = config.usages || [];
      blocklets[dir].hooks = config.hooks;
      blocklets[dir].requiredEnvironments = config.requiredEnvironments;
    }

    if (node.base === 'package.json') {
      const dir = path.dirname(node.absolutePath);

      blocklets[dir] = blocklets[dir] || {};
      blocklets[dir].packageJson = node;
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

  // Ensure we have only 1 blocklet under a directory
  const keys = Object.keys(blocklets).sort((a, b) => a.length - b.length);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    for (let j = 0; j < i; j++) {
      if (key.indexOf(keys[j]) > -1) {
        delete blocklets[key];
      }
    }
  }

  // 2. merge blocklet config
  blocklets = Object.keys(blocklets)
    .map(x => {
      const { blockletJson, packageJson } = blocklets[x];
      if (!blockletJson && !packageJson) {
        return null;
      }

      const rawAttrs = blocklets[x];
      rawAttrs.blockletJson = blockletJson ? blockletJson.absolutePath : null;
      rawAttrs.packageJson = packageJson ? packageJson.absolutePath : null;

      try {
        const selectedAttrs = readBlockletConfig(path.dirname(rawAttrs.blockletJson || rawAttrs.packageJson), {
          enableDefaults: false,
          extraAttrSpec: { htmlAst: true, main: false },
          extraRawAttrs: rawAttrs,
        });
        // Derive did from name
        selectedAttrs.did = toBlockletDid(selectedAttrs.name);
        return selectedAttrs;
      } catch (error) {
        console.warn('Read blocklet config failed.', error.message);
        return null;
      }
    })
    .filter(Boolean);

  // Remove duplicates
  blocklets = uniqBy(blocklets, x => x.name);

  await Promise.all(
    blocklets.map(async blocklet => {
      const downloads = await getNpmDownloadCount(blocklet.name);
      const { stats = {}, dist = {} } = await getNpmInfo(blocklet.name);
      debug('downloadCount.done', { name: blocklet.name, downloads });
      blocklet.stats = { downloads, updated_at: stats.updated_at };
      blocklet.dist = dist;
    })
  );

  // Exclude blocklet that's blocked by config
  blocklets = sortBy(blocklets, x => x.stats.downloads)
    .reverse()
    .filter(x => blocked.includes(x.name) === false);

  // Write blocklet list to json file
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

  // Write blocklet detail to json file
  const dataDir = path.join(__dirname, './static/blocklet');
  if (fs.existsSync(dataDir) === false) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  blocklets.forEach(x => {
    const jsonPath = path.join(dataDir, `${x.did}.json`);
    console.log('Write detail data to disk', jsonPath);
    fs.writeFileSync(jsonPath, JSON.stringify(x));
  });

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
