import { testCreateBook } from './create-book';
import { testUpdateBook } from './update-book';

describe('BookController (e2e)', () => {
  //
  describe('(POST) Create Book', testCreateBook);
  describe('(PTCH) Update Book', testUpdateBook);
});
