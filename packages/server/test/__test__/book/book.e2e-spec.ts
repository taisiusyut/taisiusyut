import { testCreateBook } from './create-book';
import { testUpdateBook } from './update-book';
import { testDeleteBook } from './delete-book';
import { testGetBooks } from './get-books';
import { testGetBook } from './get-book';
import { testBookCover } from './book-cover';
import { testFinishBook } from './finish-book';

describe('BookController (e2e)', () => {
  describe('(POST) Create Book', testCreateBook);
  describe('(PTCH) Update Book', testUpdateBook);
  describe('(DEL)  Delete Book', testDeleteBook);
  describe('(GET)  Get Books', testGetBooks);
  describe('(GET)  Get Book', testGetBook);
  describe('Fnish Book', testFinishBook);
  describe('Book Cover', testBookCover);
});
