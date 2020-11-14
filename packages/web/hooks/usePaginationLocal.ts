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

interface Props<I>
  extends Omit<Partial<UsePaginationOptions<I>>, 'onSuccess'> {}

interface Options extends CreateCRUDReducerOptions {}

export function createUsePaginationLocal<I, K extends AllowedNames<I, string>>(
  key: K,
  request: PaginateAsyncRequst<I>,
  curdOptions?: Options
) {
  const useCRUDReducer = createUseCRUDReducer<I, K>(key, curdOptions);

  return function usePaginationLocal(options?: Props<I>) {
    const [state, actions] = useCRUDReducer();
    const { query } = useRouter();

    useEffect(() => {
      actions.params(query);
    }, [actions, query]);

    const payload = paginateSelector(state);

    const { loading, pagination, fetch } = usePagination(request, {
      ...options,
      ...payload,
      onSuccess: actions.paginate
    });

    return { ...payload, fetch, actions, loading, pagination };
  };
}
