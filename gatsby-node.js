require('dotenv').config();

const childProcess = require('child_process');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const sortBy = require('lodash/sortBy');
const uniqBy = require('lodash/uniqBy');
const { languages } = require('@arcblock/www/src/libs/locale');
const parseBlockletMeta = require('@blocklet/meta/lib/parse');
const { fixInterfaces } = require('@blocklet/meta/lib/fix');
const { BLOCKLET_META_FILE, BLOCKLET_META_FILE_ALT, BLOCKLET_META_FILE_OLD } = require('@blocklet/meta/lib/constants');
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

const getNpmInfo = async name => {
  try {
    const viewStr = childProcess.execSync(`npm view ${name} --json`, { encoding: 'utf8' }) || '';
    const view = JSON.parse(viewStr);
    const { dist = {} } = view;
    delete dist['npm-signature'];
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
            childMarkdownRemark {
              htmlAst
            }
          }
        }
      }
    }
  `);
  const { edges } = data.allFile;

  // 1. group blocklet.yml/blocklet.json/package.json
  let blocklets = {};
  edges.forEach(({ node }) => {
    if (node.base === BLOCKLET_META_FILE) {
      const dir = path.dirname(node.absolutePath);
      blocklets[dir] = blocklets[dir] || {};
      blocklets[dir].dir = dir;
      blocklets[dir].blockletYml = node;
    } else if (node.base === BLOCKLET_META_FILE_ALT) {
      const dir = path.dirname(node.absolutePath);
      blocklets[dir] = blocklets[dir] || {};
      blocklets[dir].dir = dir;
      blocklets[dir].blockletYaml = node;
    } else if (node.base === BLOCKLET_META_FILE_OLD) {
      const dir = path.dirname(node.absolutePath);
      blocklets[dir] = blocklets[dir] || {};
      blocklets[dir].dir = dir;
      blocklets[dir].blockletJson = node;
    } else if (node.base === 'package.json') {
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
      const { blockletYml, blockletYaml, blockletJson, packageJson } = blocklets[x];
      if (!blockletYml && !blockletYaml && !blockletJson && !packageJson) {
        return null;
      }

      const rawAttrs = blocklets[x];
      rawAttrs.blockletYml = blockletYml ? blockletYml.absolutePath : null;
      rawAttrs.blockletYaml = blockletYaml ? blockletYaml.absolutePath : null;
      rawAttrs.blockletJson = blockletJson ? blockletJson.absolutePath : null;
      rawAttrs.packageJson = packageJson ? packageJson.absolutePath : null;

      try {
        const blockletDir = path.dirname(
          rawAttrs.blockletYml || rawAttrs.blockletYaml || rawAttrs.blockletJson || rawAttrs.packageJson
        );
        const meta = parseBlockletMeta(blockletDir, { extraRawAttrs: rawAttrs });

        if (typeof meta.environments === 'undefined') {
          meta.environments = meta.requiredEnvironments || [];
        }

        return fixInterfaces(meta, false);
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
