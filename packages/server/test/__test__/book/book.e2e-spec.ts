import { testCreateBook } from './create-book';
import { testUpdateBook } from './update-book';
import { testDeleteBook } from './delete-book';
import { testGetBooks } from './get-books';

describe('BookController (e2e)', () => {
  //
  describe('(POST) Create Book', testCreateBook);
  describe('(PTCH) Update Book', testUpdateBook);
  describe('(DEL)  Delete Book', testDeleteBook);
  describe('(GET)  Get Books', testGetBooks);
});
