import { testCreateBook } from './create-book';
import { testUpdateBook } from './update-book';
import { testDeleteBook } from './delete-book';
import { testGetBooks } from './get-books';
import { testGetBook, testGetBookByName } from './get-book';
import { testBookCover } from './book-cover';
import { testWordCount } from './word-count';
import { testPublicAndFinishBook } from './public-finish-book';

describe('BookController (e2e)', () => {
  describe('(POST) Create Book', testCreateBook);
  describe('(PATCH) Update Book', testUpdateBook);
  describe('(DEL) Delete Book', testDeleteBook);
  describe('(GET) Get Books', testGetBooks);
  describe('(GET) Get Book', testGetBook);
  describe('(GET) Get Book By Name', testGetBookByName);
  describe('(POST) Public and Fnish Book', testPublicAndFinishBook);
  describe('(OTHER) Book Cover', testBookCover);
  describe('(OTHER) Word Count', testWordCount);
});
