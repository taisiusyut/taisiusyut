// @ts-check

process.env.NODE_ENV = process.env.NODE_ENV || 'production';

const { env } = require('./env');

/**
 * @param {import('@expo/config').ConfigContext} param0
 * @returns {Partial<import('@expo/config').ExpoConfig>}
 */
const config = ({ config }) => ({
  ...config,
  extra: {
    ...config.extra,
    ...env
  }
});

export default config;
