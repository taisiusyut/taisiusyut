// @ts-check
const fs = require('fs');
const path = require('path');
const {
  clearFeaturedData,
  getClientFeaturedPageData
} = require('./service/featured');
const { projectRoot } = require('./env');

const distDir = path.resolve(process.cwd(), `./.next`);

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir);
}

// since `next build` command cannot load the env files at root directory
// so copy these env files before build
function copyEnvFiles() {
  const files = [
    '.env',
    '.env.local',
    '.env.production',
    '.env.production.local'
  ];

  for (const filename of files) {
    const src = path.resolve(projectRoot, filename);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, filename);
    }
  }
}

async function init() {
  copyEnvFiles();

  clearFeaturedData();
  await getClientFeaturedPageData();
  process.exit();
}

init();
