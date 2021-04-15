const ghpages = require('gh-pages');
const { spawn } = require('./spawn');

// github page url
const publicURL = `https://taisiusyut.github.io/taisiusyut`;
const output = 'dist';

if (!publicURL) {
  throw new Error(`repository url not defined`);
}

spawn('expo', [
  'export',
  `--force`,
  `--public-url`,
  publicURL,
  `--output-dir`,
  output
]);

ghpages.publish(output, { branch: 'expo-app' }, function (error) {
  // eslint-disable-next-line
  console.log(error);
});
