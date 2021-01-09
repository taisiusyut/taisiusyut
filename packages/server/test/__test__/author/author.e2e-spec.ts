import { testGetAuthor } from './get-author';
import { testAuthorWordCount } from './word-count';

describe('AuthorController (e2e)', () => {
  describe('(GET) Get Author', testGetAuthor);
  describe('(POST) Word Count', testAuthorWordCount);
});
