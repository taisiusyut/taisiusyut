import { testCreateBook } from './create-book';
import { testUpdateBook } from './update-book';
import { testGetBooks } from './get-books';

describe('BookController (e2e)', () => {
  //
  describe('(POST) Create Book', testCreateBook);
  describe('(PTCH) Update Book', testUpdateBook);
  describe('(GET)  Get Books', testGetBooks);
});
