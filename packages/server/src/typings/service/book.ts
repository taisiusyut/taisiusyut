import { Timestamp, Pagination, Search, DateRange } from './';

export enum BookStatus {
  Pending = 1,
  Approved = 2,
  Private = 3,
  Public = 9999
}

export interface Schema$Book extends Timestamp {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  author: string; //ObjectId
  status: BookStatus;
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
