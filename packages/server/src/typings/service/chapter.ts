import { Pagination, Timestamp, Search, DateRange } from './';
import { Schema$Book } from './book';

export enum ChapterStatus {
  Pending = 1,
  Approved = 2,
  Private = 3,
  Public = 9999
}

export enum ChapterType {
  Free = 1,
  Pay
}

export interface Schema$ChapterBook extends Partial<Schema$Book> {}

export interface Schema$Chapter extends Timestamp {
  id: string;
  name: string;
  content: string;
  status: ChapterStatus;
  type: ChapterType;
  price: number;
  book: unknown;
}

export interface Param$CreateChapter {
  bookID: string;
  name: string;
  content: string;
  type: ChapterType;
  price: number;
}

export interface Param$UpdateChapter {
  bookID: string;
  chapterID: string;
  name?: string;
  content?: string;
  status?: ChapterStatus;
  type?: ChapterType;
}

export interface Param$GetChapters extends Pagination, Search {
  bookID: string;
  status?: ChapterStatus;
  type?: ChapterType;
  createdAt?: DateRange;
  updatedAt?: DateRange;
}
