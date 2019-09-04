/* eslint global-require:"off" */
const flatten = require('flat');

module.exports = flatten({
  blocklets: require('./blocklets/en'),
});
