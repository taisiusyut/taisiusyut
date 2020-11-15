import { useCallback, useEffect } from 'react';
import { useRxAsync, RxAsyncFn } from 'use-rx-hooks';
import { PaginateResult, Pagination } from '@/typings';
import { PaginatePayload } from '@/hooks/crud-reducer';
import { PaginationProps } from '@/components/Pagination';
import { setSearchParam } from '@/utils/setSearchParam';

type Response<I> = I[] | PaginateResult<I>;

export type PaginateAsyncRequst<I> = RxAsyncFn<Response<I>, Pagination>;

export interface UsePaginationOptions<I> {
  pageNo: number;
  total: number;
  pageSize: number;
  hasData?: boolean;
  params: any;
  onSuccess?: (res: PaginatePayload<I>) => void;
  onFailure?: (error: any) => void;
}

export function usePagination<I>(
  asyncFn: PaginateAsyncRequst<I>,
  {
    onSuccess,
    onFailure,
    total,
    pageSize,
    hasData,
    pageNo,
    params
  }: UsePaginationOptions<I>
) {
  const onSuccessCallback = useCallback(
    (res: Response<I>) => {
      const [data, total] = Array.isArray(res)
        ? [res, res.length]
        : [res.data, res.total];
      onSuccess && onSuccess({ data, total, pageNo });
    },
    [onSuccess, pageNo]
  );

  const [asyncState, { fetch }] = useRxAsync(asyncFn, {
    defer: true,
    onFailure,
    onSuccess: onSuccessCallback
  });

  const pagination: PaginationProps | undefined = {
    total,
    pageNo,
    pageSize,
    onPageChange: pageNo => setSearchParam(params => ({ ...params, pageNo }))
  };

  useEffect(() => {
    if (!hasData) {
      fetch({ page: pageNo, size: pageSize, ...params });
    }
  }, [hasData, fetch, pageNo, pageSize, params]);

  return { ...asyncState, fetch, pagination };
}
