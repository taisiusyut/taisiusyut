import { Timestamp, Pagination, Search, DateRange } from './';
import { Schema$Author } from './user';

export enum BookStatus {
  Pending = 1,
  Approved = 2,
  Private = 3,
  Public = 9999
}

export interface Schema$BookAuthor extends Partial<Schema$Author> {
  nickname: string;
  description?: string;
}

export interface Schema$Book extends Timestamp {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  cover?: string;
  author: Schema$BookAuthor; //ObjectId
  status?: BookStatus;
}

export interface Param$CreateBook {
  name: string;
  description?: string;
  category?: string;
  tags?: string[];
  cover?: string;
}

export interface Param$UpdateBook {
  id: string;
  name?: string;
  description?: string;
  category?: string;
  tags?: string[];
  cover?: string | null;
}

export interface Param$GetBooks extends Pagination, Search {
  category?: string;
  tags?: string[];
  author?: string; //ObjectId
  createdAt?: DateRange;
  updatedAt?: DateRange;
}

export interface Schema$Category {
  category: string;
  total: number;
}

export interface Schema$Tags {
  tag: string;
  total: number;
}
