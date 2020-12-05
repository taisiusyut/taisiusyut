import { Timestamp, Pagination } from './index';
import { Schema$Book } from './book';

export interface Schema$BookShelf extends Timestamp {
  id: string;
  user: string;
  book: Schema$Book;
  pin?: boolean;
  lastVisit?: number | null;
  latestChapter?: string | null;
}

export interface Param$GetBooksFromShelf extends Pagination {}

export interface Param$AddBookToShelf {
  book: string;
}

export interface Param$RemoveBookFromShelf {
  book: string;
}

export interface Param$UpdateBookInShelf {
  pin?: boolean;
  lastVisit?: number;
}
