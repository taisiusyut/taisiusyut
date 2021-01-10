// @ts-check
const fs = require('fs');
const path = require('path');
const {
  clearFeaturedData,
  getClientFeaturedPageData
} = require('./service/featured');

const distDir = path.resolve(process.cwd(), `./.next`);

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir);
}

async function init() {
  clearFeaturedData();
  await getClientFeaturedPageData();

  process.exit();
}

init();
