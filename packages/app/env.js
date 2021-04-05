// borrow from
// https://github.com/facebook/create-react-app/blob/7e4949a20fc828577fb7626a3262832422f3ae3b/packages/react-scripts/config/env.js

const fs = require('fs');
const path = require('path');

const NODE_ENV = process.env.NODE_ENV;
if (!NODE_ENV) {
  throw new Error(
    'The NODE_ENV environment variable is required but was not specified.'
  );
}

/** @type {Record<string, string>} */
let env = { NODE_ENV };

// https://github.com/bkeepers/dotenv#what-other-env-files-can-i-use
const dotenvFiles = [
  `.env.${NODE_ENV}.local`,
  // Don't include `.env.local` for `test` environment
  // since normally you expect tests to produce the same
  // results for everyone
  NODE_ENV !== 'test' && `.env.local`,
  `.env.${NODE_ENV}`,
  '.env'
]
  .filter(
    /** @type {(s: unknown) => s is string} */
    s => !!s
  )
  .map(filename => path.resolve(__dirname, filename));

// Load environment variables from .env* files. Suppress warnings using silent
// if this file is missing. dotenv will never modify any environment variables
// that have already been set.  Variable expansion is supported in .env files.
// https://github.com/motdotla/dotenv
// https://github.com/motdotla/dotenv-expand
dotenvFiles.forEach(dotenvFile => {
  if (fs.existsSync(dotenvFile)) {
    const { parsed } = require('dotenv-expand')(
      require('dotenv').config({
        path: dotenvFile
      })
    );
    env = { ...env, ...parsed };
  }
});

module.exports = { env };
