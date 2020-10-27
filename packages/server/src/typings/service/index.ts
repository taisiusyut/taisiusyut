import { AxiosError, AxiosResponse } from 'axios';

export * from './user';

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
  limit: number;
  page: number;
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
  ASC,
  DESC
}

export interface Pagination<T = any> {
  page?: number;
  size?: number;
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
