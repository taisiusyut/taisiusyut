import { useEffect } from 'react';
import router from 'next/router';
import { useRxAsync } from 'use-rx-hooks';
import {
  AllowedNames,
  paginateSelector,
  createUseCRUDReducer,
  CreateUseCRUDReducerOps,
  CRUDState,
  Dispatched,
  CRUDActionCreators
} from '@/hooks/crud-reducer';
import { PaginateResult } from '@/typings';
import { PaginationProps } from '@/components/Pagination';
import { setSearchParam } from '@/utils/setSearchParam';
import qs from 'qs';

interface Options {
  onFailure?: (error: any) => void;
}

type UsePaginationLocal<
  I,
  K extends AllowedNames<I, string>,
  Prefill = Partial<I>
> = (
  options?: Options | undefined
) => {
  state: CRUDState<I, Prefill>;
  fetch: any;
  actions: Dispatched<CRUDActionCreators<I, K>>;
  loading: boolean;
  pagination: PaginationProps;
};

interface CrudOptions<Prefill> extends CreateUseCRUDReducerOps<Prefill> {}

const getParams = (path: string) => qs.parse(path.split('?')[1] || '');

const createPlaceHolder = <Prefill>(length: number, prefill: Prefill) => ({
  ids: Array.from({ length }, (_, index) => String(index)),
  list: Array.from({ length }, () => prefill)
});

export function createUsePaginationLocal<I, K extends AllowedNames<I, string>>(
  key: K,
  request: <P>(params?: P) => Promise<PaginateResult<I>>
): UsePaginationLocal<I, K, Partial<I>>;

export function createUsePaginationLocal<I, K extends AllowedNames<I, string>>(
  key: K,
  request: <P>(params?: P) => Promise<PaginateResult<I>>,
  curdOptions: CrudOptions<false> & { prefill: false }
): UsePaginationLocal<I, K, false>;

export function createUsePaginationLocal<I, K extends AllowedNames<I, string>>(
  key: K,
  request: <P>(params?: P) => Promise<PaginateResult<I>>,
  curdOptions: CrudOptions<Partial<I>> & { prefill?: {} }
): UsePaginationLocal<I, K, false>;

export function createUsePaginationLocal<I, K extends AllowedNames<I, string>>(
  key: K,
  request: <P>(params?: P) => Promise<PaginateResult<I>>,
  {
    defaultState,
    prefill = {},
    ...curdOptions
  }: CrudOptions<Partial<I> | false> = {}
): UsePaginationLocal<I, K, Partial<I> | false> {
  const initialParams = getParams(
    typeof window !== 'undefined' ? window.location.href : ''
  );
  delete initialParams['pageNo'];
  delete initialParams['pageSIze'];

  const useCRUDReducer = createUseCRUDReducer<I, K, Partial<I> | false>(key, {
    ...curdOptions,
    prefill,
    defaultState: {
      ...defaultState,
      ...(prefill !== false &&
        (createPlaceHolder(10, prefill) as Pick<
          CRUDState<I, Partial<I>>,
          'ids' | 'list'
        >)),
      params: initialParams
    }
  });

  return function usePaginationLocal(options?: Options) {
    const [state, actions] = useCRUDReducer();
    const { asPath } = router;
    const { pageNo, pageSize, params } = state;

    const [{ loading }, { fetch }] = useRxAsync(request, {
      ...options,
      defer: true,
      onSuccess: actions.paginate
    });

    const { hasData } = paginateSelector(state, {
      prefill: {}
    });

    useEffect(() => {
      actions.params(getParams(asPath));
    }, [actions, asPath]);

    useEffect(() => {
      // async pageNo since it may change as CRUD actions
      if (router.query.pageNo && Number(router.query.pageNo) !== pageNo) {
        setSearchParam(params => ({ ...params, pageNo }));
      }
    }, [pageNo]);

    useEffect(() => {
      if (!hasData) {
        fetch({ pageNo, pageSize, ...params });
      }
    }, [hasData, pageNo, pageSize, params, fetch]);

    const pagination: PaginationProps = {
      pageNo: state.pageNo,
      pageSize: state.pageSize,
      total: state.total,
      onPageChange: (pageNo: number) =>
        setSearchParam(params => ({ ...params, pageNo }))
    };

    return {
      state,
      fetch,
      actions,
      loading,
      pagination
    };
  };
}
