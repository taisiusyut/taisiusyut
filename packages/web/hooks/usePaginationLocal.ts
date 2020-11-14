import { useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  AllowedNames,
  paginateSelector,
  createUseCRUDReducer,
  CreateCRUDReducerOptions
} from '@/hooks/crud-reducer';
import {
  usePagination,
  PaginateAsyncRequst,
  UsePaginationOptions
} from './usePagination';
import qs from 'qs';

interface Props<I>
  extends Omit<Partial<UsePaginationOptions<I>>, 'onSuccess'> {}

interface Options<T> extends CreateCRUDReducerOptions<Partial<T>> {}

export function createUsePaginationLocal<I, K extends AllowedNames<I, string>>(
  key: K,
  request: PaginateAsyncRequst<I>,
  curdOptions?: Options<I>
) {
  const useCRUDReducer = createUseCRUDReducer<I, K>(key, {
    ...curdOptions,
    prefill: {}
  });

  return function usePaginationLocal(options?: Props<I>) {
    const [state, actions] = useCRUDReducer();
    const { asPath } = useRouter();

    useEffect(() => {
      actions.params(qs.parse(asPath.split('?')[1] || ''));
    }, [actions, asPath]);

    const payload = paginateSelector(state, { prefill: {} });

    const { loading, pagination, fetch } = usePagination(request, {
      ...options,
      ...payload,
      onSuccess: actions.paginate
    });

    return { ...payload, fetch, actions, loading, pagination };
  };
}
