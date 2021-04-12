import { Timestamp, Pagination } from './index';
import { Schema$Book } from './book';

export type BookInShelf = Pick<
  Schema$Book,
  'id' | 'name' | 'authorName' | 'status' | 'cover' | 'latestChapter'
>;

export interface Schema$BookShelf extends Timestamp {
  id: string;
  user: string;
  book: BookInShelf | null;
  pin?: boolean;
  lastVisit?: number | null;
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
