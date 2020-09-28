/* eslint-disable no-console */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const sleep = timeout => new Promise(resolve => setTimeout(resolve, timeout));

const processPackage = async json => {
  try {
    const res = await axios.put(`https://npm.taobao.org/sync/${json.name}?sync_upstream=true`);
    console.log('trigger cnpm sync success', json.name, res.data);
  } catch (err) {
    console.error('trigger cnpm sync failed', json.name, err);
  }
};

const sendAlerts = packageDirs => {
  packageDirs.forEach(dir => {
    const packages = fs.readdirSync(path.join(__dirname, dir));
    packages.forEach(async (x, i) => {
      const packageFile = path.join(__dirname, dir, x, 'package.json');
      if (fs.existsSync(packageFile)) {
        await sleep(i * 200);
        const json = require(packageFile);
        await processPackage(json);
      }
    });
  });
};

sendAlerts(['.']);
