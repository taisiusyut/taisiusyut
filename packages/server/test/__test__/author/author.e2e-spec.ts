import { testGetAuthor } from './get-author';
import { testAuthorWordCount } from './word-count';
import { testUpdateBookCollection } from './check-book-collection';

describe('AuthorController (e2e)', () => {
  describe('(GET) Get Author', testGetAuthor);
  describe('(POST) Word Count', testAuthorWordCount);
  describe('(POST) Book Collection', testUpdateBookCollection);
});
