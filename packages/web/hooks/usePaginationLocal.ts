import { useState, useEffect, useMemo, useReducer } from 'react';
import router, { useRouter } from 'next/router';
import { useRxAsync } from 'use-rx-hooks';
import {
  AllowedNames,
  paginateSelector,
  CreateCRUDReducerOptions,
  CRUDState,
  Dispatched,
  CRUDActionCreators,
  createCRUDReducer,
  getCRUDActionsCreator,
  bindDispatch,
  CRUDReducer,
  CRUDActionTypes,
  DefaultCRUDActionTypes
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
  Prefill extends boolean = true
> = (
  options?: Options | undefined
) => {
  data: CRUDState<I, Prefill>['list'];
  state: CRUDState<I, Prefill>;
  fetch: any;
  actions: Dispatched<CRUDActionCreators<I, K>>;
  loading: boolean;
  pagination: PaginationProps;
};

interface UsePaginationOptions<
  I,
  K extends AllowedNames<I, string>,
  Prefill extends boolean
> extends CreateCRUDReducerOptions<Prefill> {
  initializer?: (
    initialState: CRUDState<I, Prefill>,
    reducer: CRUDReducer<I, K, Prefill, CRUDActionTypes>
  ) => CRUDState<I, Prefill>;
}

const getParams = (path: string) => qs.parse(path.split('?')[1] || '');

export { DefaultCRUDActionTypes };

export function createUsePaginationLocal<I, K extends AllowedNames<I, string>>(
  key: K,
  request: <P>(params?: P) => Promise<PaginateResult<I>>,
  curdOptions?: UsePaginationOptions<I, K, true>
): UsePaginationLocal<I, K, true>;

export function createUsePaginationLocal<I, K extends AllowedNames<I, string>>(
  key: K,
  request: <P>(params?: P) => Promise<PaginateResult<I>>,
  curdOptions: UsePaginationOptions<I, K, false> & { prefill: false }
): UsePaginationLocal<I, K, false>;

export function createUsePaginationLocal<I, K extends AllowedNames<I, string>>(
  key: K,
  request: <P>(params?: P) => Promise<PaginateResult<I>>,
  { initializer, ...curdOptions }: UsePaginationOptions<I, K, boolean> = {}
): UsePaginationLocal<I, K, boolean> {
  const initialParams = getParams(
    typeof window !== 'undefined' ? window.location.href : ''
  );
  delete initialParams['pageNo'];
  delete initialParams['pageSIze'];

  const [initialState, reducer] = createCRUDReducer<I, K>(key, {
    ...curdOptions,
    actionTypes: DefaultCRUDActionTypes
  });

  return function usePaginationLocal(options?: Options) {
    const { asPath } = useRouter();

    const [state, dispatch] = useReducer(reducer, initialState, state => {
      const withParam = reducer(state, {
        type: DefaultCRUDActionTypes.PARAMS,
        payload: getParams(asPath)
      });
      return initializer ? initializer(withParam, reducer) : withParam;
    });

    const [actions] = useState(() => {
      const [actions] = getCRUDActionsCreator<I, K>()();
      return { dispatch, ...bindDispatch(actions, dispatch) };
    });
    const { pageNo, pageSize, params } = state;

    const [{ loading }, { fetch }] = useRxAsync(request, {
      ...options,
      defer: true,
      onSuccess: actions.paginate
    });

    const { hasData, list } = useMemo(() => paginateSelector(state), [state]);

    useEffect(() => {
      actions.params(getParams(asPath));
    }, [actions, asPath]);

    useEffect(() => {
      // sync pageNo since it may change as CRUD actions
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
      data: list,
      state,
      fetch,
      actions,
      loading,
      pagination
    };
  };
}
