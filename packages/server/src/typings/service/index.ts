import { AxiosError, AxiosResponse } from 'axios';

export * from './auth';
export * from './book';
export * from './chapter';
export * from './cloudinary';
export * from './user';
export * from './payment';
export * from './permissions';

export interface ApiResponse<T> {
  statusCode: number;
  data: T;
}

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
  createdAt: string;
  updatedAt: string;
}

export type DateRange = [string, string];

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

interface ApiErrorValue {
  statusCode: number;
  message: string | string[];
  error?: string;
}

export interface ApiError extends Omit<AxiosError, 'response'> {
  response?: AxiosResponse<ApiErrorValue | string>;
}

export type UnionKeys<T> = T extends any ? keyof T : never;
export type Insertion<T> = { [K in UnionKeys<T>]?: T[K] };
