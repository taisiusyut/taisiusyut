import { CRUDState } from './crudReducer';

export interface PaginateState<S extends CRUDState<unknown, any>> {
  ids: S['ids'];
  list: S['list'];
  pageNo: number;
  pageSize: number;
  total: number;
  params: any;
  hasData: boolean;
}

export interface PaginateSelectorOptions {
  prefill?: unknown;
}

export function paginateSelector<S extends CRUDState<any, any>>({
  list,
  ids,
  pageNo,
  pageSize,
  params,
  total
}: S): PaginateState<S> {
  const start = (pageNo - 1) * pageSize;
  const _list = list.slice(start, start + pageSize);
  const _ids = ids.slice(start, start + pageSize);

  // all data should be checked.
  // so if one of the data deleted and indicates a new request is required.
  const hasData = _list.some(
    item => !item || (typeof item === 'object' && Object.keys(item).length > 1)
  );

  return {
    list: _list,
    ids: _ids,
    pageNo,
    pageSize,
    total,
    params,
    hasData
  };
}
