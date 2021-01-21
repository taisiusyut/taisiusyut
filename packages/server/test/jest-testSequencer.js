// @ts-check

const Sequencer = require('@jest/test-sequencer').default;

/**
 * @param {string} path
 */
function getFilenameFromPath(path) {
  return path.split('/').slice(-1)[0].replace(/\..*$/, '');
}

const orders = ['book', 'book-shelf'];

class CustomSequencer extends Sequencer {
  /**
   * @param {import('jest-runner').Test[]} tests
   */
  sort(tests) {
    // Test structure information
    // https://github.com/facebook/jest/blob/6b8b1404a1d9254e7d5d90a8934087a9c9899dab/packages/jest-runner/src/types.ts#L17-L21
    const copyTests = Array.from(tests);

    return copyTests.sort((testA, testB) => {
      const nameA = getFilenameFromPath(testA.path);
      const nameB = getFilenameFromPath(testB.path);
      if (orders.includes(nameA) && orders.includes(nameB)) {
        return orders.indexOf(nameA) - orders.indexOf(nameB);
      }
      return nameA.localeCompare(nameB);
    });
  }
}

module.exports = CustomSequencer;
