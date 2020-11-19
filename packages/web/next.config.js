module.exports = {
  images: {
    domains: ['res.cloudinary.com']
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5000/api/:path*'
      }
    ];
  }
};
