const path = require('path');
const withPlugins = require('next-compose-plugins');
const withPWA = require('next-pwa');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
});

module.exports = withPlugins(
  [
    //
    [withBundleAnalyzer]
  ],
  withPWA({
    webpack: (config, { webpack }) => {
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
    exportPathMap: function () {
      return {
        '/explore': { page: '/' }
      };
    },
    async rewrites() {
      return process.env.NODE_ENV === 'production'
        ? []
        : [
            {
              source: '/api/:path*',
              destination: 'http://localhost:5000/api/:path*'
            }
          ];
    }
  })
);
