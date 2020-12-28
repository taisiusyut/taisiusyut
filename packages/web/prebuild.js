// @ts-check

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
