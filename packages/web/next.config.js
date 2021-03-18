const path = require('path');
const withPlugins = require('next-compose-plugins');
const withPWA = require('next-pwa');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
});

/** @typedef {typeof import('webpack')} Webapck */
/** @typedef {import('webpack').Configuration} Configuration */

module.exports = withPlugins(
  [
    //
    [withBundleAnalyzer]
  ],
  withPWA({
    /**
     * @param {Configuration} config
     * @param {{webpack: Webapck}} options
     * @returns {Configuration}
     */
    webpack: (config, { webpack, defaultLoaders }) => {
      config.module.rules.push({
        test: /\.mdx?/,
        use: [
          defaultLoaders.babel,
          {
            loader: '@mdx-js/loader',
            options: {}
          }
        ]
      });

      // reduce biundle size of `@blueprintjs/core`
      config.plugins.push(
        new webpack.NormalModuleReplacementPlugin(
          /.*\/generated\/iconSvgPaths.*/,
          path.resolve(__dirname, 'iconSvgPaths.js')
        )
      );

      return config;
    },
    // Do not enable strict mode globally.
    // Since @blueprintjs is violate the strict mode ...
    reactStrictMode: false,
    images: {
      domains: ['res.cloudinary.com']
    },
    pwa: {
      dest: 'public',
      disable: process.env.NODE_ENV !== 'production'
    },
    async rewrites() {
      const payload = [];

      if (process.env.NODE_ENV === 'development') {
        payload.push({
          source: '/api/:path*',
          destination: 'http://localhost:5000/api/:path*'
        });
      }

      return payload;
    }
  })
);
