export * from './auth';
export * from './announcement';
export * from './book';
export * from './bug-report';
export * from './chapter';
export * from './cloudinary';
export * from './user';
export * from './payment';
export * from './shelf';

export interface PaginateApiResponse<T> {
  statusCode: number;
  data: PaginateResult<T>;
}

export interface PaginateResult<T> {
  data: T[];
  total: number;
  pageSize: number;
  pageNo: number;
  totalPages: number;
  nextPage?: number | null;
  prevPage?: number | null;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  meta?: any;
}

export interface Timestamp {
  createdAt: number;
  updatedAt: number;
}

export type DateRange = [string | number, string | number];

export type DateRangeQuery = {
  createdAt?: DateRange;
  updatedAt?: DateRange;
};

export enum Order {
  ASC = 1,
  DESC = -1
}

export interface Pagination<T = any> {
  pageNo?: number;
  pageSize?: number;
  sort?: string | Record<keyof T, Order>;
}

export interface Search {
  search?: string;
}

export type UnionKeys<T> = T extends any ? keyof T : never;
export type Insertion<T> = { [K in UnionKeys<T>]?: T[K] };
