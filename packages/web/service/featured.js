// @ts-check
/**
 * @typedef {{
 *  updatedAt: number,
 *  data: import('@/components/client/Featured').FeaturedProps['data']
 * }} Result
 */

const fs = require('fs');
const path = require('path');
const { BookStatus, Order } = require('@taisiusyut/server/dist/typings');
const { getBookService, serialize } = require('./server');

const featuredDest = path.resolve(process.cwd(), './.next/featured.json');

/**
 * @function
 * @returns {Promise<Result>}
 */
async function getClientFeaturedPageData() {
  /** @type {Result | undefined} */
  let result = await new Promise(resolve => {
    fs.readFile(featuredDest, { encoding: 'utf-8' }, (error, content) => {
      resolve(error ? undefined : JSON.parse(content));
    });
  });

  if (!result) {
    const bookService = await getBookService();
    const limit = 6;
    const response = await Promise.all([
      bookService.random(limit),
      bookService.random(limit),
      bookService.random(limit),
      bookService.findAll({ status: BookStatus.Finished }, null, {
        sort: { updatedAt: Order.DESC },
        limit
      })
    ]);

    /** @type {Result['data']['mostvisited'][]} */
    const [
      mostvisited,
      clientSuggested,
      adminSuggested,
      finished
    ] = response.map(books => {
      return books.map(doc => serialize(doc));
    });

    result = {
      updatedAt: new Date().getTime(),
      data: {
        mostvisited,
        adminSuggested,
        clientSuggested,
        finished
      }
    };

    fs.writeFileSync(featuredDest, JSON.stringify(result));
  }

  return result;
}

function clearFeaturedData() {
  if (fs.existsSync(featuredDest)) {
    fs.unlinkSync(featuredDest);
  }
}

module.exports = {
  featuredDest,
  clearFeaturedData,
  getClientFeaturedPageData
};
