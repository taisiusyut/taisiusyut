import { Timestamp, Pagination } from './index';
import { Schema$Book } from './book';
import { Schema$Chapter } from './chapter';

export interface Schema$BookShelf extends Timestamp {
  id: string;
  user: string;
  book: Schema$Book;
  pin?: boolean;
  lastVisit?: number | null;
  latestChapter?: Schema$Chapter | null;
}

export interface Param$GetBooksFromShelf extends Pagination {}

export interface Param$AddBookToShelf {
  book: string;
}

export interface Param$RemoveBookFromShelf {
  book: string;
}

export interface Param$UpdateBookInShelf {
  bookID: string;
  pin?: boolean;
  lastVisit?: number;
}
