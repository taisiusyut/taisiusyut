// @ts-check

const fs = require('fs');
const path = require('path');

const distDir = path.resolve(process.cwd(), `./.next`);

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir);
}

const {
  clearFeaturedData,
  getClientFeaturedPageData
} = require('./service/featured');

async function init() {
  clearFeaturedData();
  await getClientFeaturedPageData();

  process.exit();
}

init();
