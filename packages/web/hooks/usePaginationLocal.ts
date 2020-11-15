import { useEffect, useLayoutEffect } from 'react';
import router from 'next/router';
import { useRxAsync } from 'use-rx-hooks';
import {
  AllowedNames,
  paginateSelector,
  createUseCRUDReducer,
  CreateCRUDReducerOptions
} from '@/hooks/crud-reducer';
import { PaginateResult } from '@/typings';
import { PaginationProps } from '@/components/Pagination';
import { setSearchParam } from '@/utils/setSearchParam';
import qs from 'qs';

interface Props {
  onFailure?: (error: any) => void;
}

interface CrudOptions<T> extends CreateCRUDReducerOptions<Partial<T>> {}

export function createUsePaginationLocal<I, K extends AllowedNames<I, string>>(
  key: K,
  request: <P>(params?: P) => Promise<PaginateResult<I>>,
  curdOptions?: CrudOptions<I>
) {
  const useCRUDReducer = createUseCRUDReducer<I, K>(key, {
    ...curdOptions,
    prefill: {}
  });

  return function usePaginationLocal(options?: Props) {
    const [state, actions] = useCRUDReducer();
    const { asPath } = router;
    const { pageNo } = state;

    const [{ loading }, { fetch }] = useRxAsync(request, {
      ...options,
      defer: true,
      onSuccess: actions.paginate
    });

    useEffect(() => {
      actions.params(qs.parse(asPath.split('?')[1] || ''));
    }, [actions, asPath]);

    useEffect(() => {
      // async pageNo since it may change as CRUD actions
      if (router.query.pageNo && Number(router.query.pageNo) !== pageNo) {
        setSearchParam(params => ({ ...params, pageNo }));
      }
    }, [pageNo]);

    useLayoutEffect(() => {
      const { hasData, pageNo, pageSize, params } = paginateSelector(state, {
        prefill: {}
      });
      if (!hasData) {
        fetch({ pageNo, pageSize, ...params });
      }
    }, [state, fetch]);

    const pagination: PaginationProps = {
      pageNo: state.pageNo,
      pageSize: state.pageSize,
      total: state.total,
      onPageChange: (pageNo: number) =>
        setSearchParam(params => ({ ...params, pageNo }))
    };

    return {
      ...state,
      fetch,
      actions,
      loading,
      pagination
    };
  };
}
