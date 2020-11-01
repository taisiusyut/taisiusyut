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
  title: string;
  description: string;
  category: string;
  tags: string[];
  author: Schema$BookAuthor; //ObjectId
  status?: BookStatus;
}

export interface Param$CreateBook {
  title: string;
  description?: string;
  category?: string;
  tags?: string[];
}

export interface Param$UpdateBook {
  id: string;
  title?: string;
  description?: string;
  category?: string;
  tags?: string[];
}

export interface Param$GetBooks extends Pagination, Search {
  id?: string;
  title?: string;
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
