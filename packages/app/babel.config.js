// @ts-check
const path = require('path');
const resolve = require('resolve');

const extensions = ['.js', '.jsx', '.es', '.es6', '.mjs', '.ts', '.tsx'];

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
            /**
             * @param {string[]} param0
             * @returns {string}
             */
            '@/utils': ([pathname]) => {
              const commonFilePath = path.join(
                __dirname,
                '../../node_modules/@taisiusyut/common',
                pathname.slice(1)
              );
              const filePath = path.join(__dirname, pathname.slice(1));

              for (const p of [commonFilePath, filePath]) {
                try {
                  const resolved = resolve.sync(p, { extensions });
                  console.log('module-resolver', resolved);
                  return resolved;
                } catch (error) {}
              }
              return pathname;
            },
            '@': __dirname
          }
        }
      ]
    ]
  };
};
