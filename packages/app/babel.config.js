// @ts-check
const fs = require('fs');
const path = require('path');

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
                const resolved = require.resolve(p);
                if (fs.existsSync(resolved)) {
                  console.log('module-resolver', resolved);
                  return resolved;
                }
              }
              return pathname;
            },
            '@': __dirname
          },
          extensions: ['.js', '.jsx', '.es', '.es6', '.mjs', '.ts', '.tsx']
        }
      ]
    ]
  };
};
