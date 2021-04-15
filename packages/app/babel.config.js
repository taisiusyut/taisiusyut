// @ts-check
const path = require('path');
const resolve = require('resolve');

const extensions = ['.js', '.jsx', '.ts', '.tsx', '.d.ts'];

/**
 * @param {string} suffix
 */
function createAliasHandler(suffix) {
  /**
   * @param {string[]} param0
   * @returns {string}
   */
  function handler([pathname]) {
    const targetFilePath = path.join(
      __dirname,
      `../../node_modules/@taisiusyut/${suffix}`,
      pathname.slice(1)
    );
    const defaultFilePath = path.join(__dirname, pathname.slice(1));

    for (const pathname of [defaultFilePath, targetFilePath]) {
      try {
        const resolved = resolve.sync(pathname, { extensions });
        return resolved;
      } catch (error) {}
    }
    return pathname;
  }
  return handler;
}

/**
 * @param {*} api
 */
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          extensions,
          alias: {
            '@/typings': createAliasHandler('server/dist'),
            '@/utils': createAliasHandler('common'),
            '@': __dirname
          }
        }
      ]
    ]
  };
};
