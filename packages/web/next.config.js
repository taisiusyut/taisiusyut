global.app = undefined;
global.appPromise = undefined;

module.exports = {
  // Do not enable strict mode globally.
  // Since @blueprintjs is violate the strict mode ...
  reactStrictMode: false,
  images: {
    domains: ['res.cloudinary.com']
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
};
