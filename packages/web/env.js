const path = require('path');
const { loadEnvConfig: DefaultloadEnvConfig } = require('@next/env');

const projectRoot = path.resolve(__dirname, '../../');

function loadEnvConfig() {
  const { loadedEnvFiles } = DefaultloadEnvConfig(
    projectRoot,
    process.env.NODE_ENV !== 'production'
  );

  if (loadedEnvFiles.length === 0) {
    throw new Error(`No env files loaded`);
  }
}

module.exports = { projectRoot, loadEnvConfig };
