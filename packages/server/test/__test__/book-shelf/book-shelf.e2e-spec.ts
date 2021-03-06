import { testGetBooksFromShelf } from './get-books-from-shelf';
import { testAddBookToShelf } from './add-book-to-shelf';
import { testRemoveBookFromShelf } from './remove-book-from-shelf';
import { testUpdateBookInShelf } from './update-book-in-shelf';

describe('BookShelfController (e2e)', () => {
  describe('(POST) Add Book To Shelf', testAddBookToShelf);
  describe('(GET) Get Books from Shelf', testGetBooksFromShelf);
  describe('(DEL) Remove Book From Shelf', testRemoveBookFromShelf);
  describe('(PATCH) Update Book in Shelf', testUpdateBookInShelf);
});
