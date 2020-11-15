/* eslint-disable @typescript-eslint/ban-types */

import {
  Key,
  CRUDActions,
  CRUDActionTypes,
  PaginatePayload,
  DefaultCRUDActionTypes,
  isAction,
  List
} from './crudAction';

export interface CRUDState<I, Prefill extends any = null> {
  ids: string[];
  byIds: Record<string, I>;
  list: Prefill extends false ? I[] : (I | Prefill)[];
  pageNo: number;
  pageSize: number;
  total: number;
  params: any;
}

export type CRUDReducer<
  I,
  K extends Key<I>,
  Prefill extends any = null,
  M extends CRUDActionTypes = CRUDActionTypes
> = (
  state: CRUDState<I, Prefill>,
  action: CRUDActions<I, K, M>
) => CRUDState<I, Prefill>;

export interface CreateCRUDReducerOptions<
  Prefill extends any = null,
  M extends CRUDActionTypes = CRUDActionTypes
> {
  prefill?: Prefill;
  actionTypes?: M;
  keyGenerator?: (index: number) => string;
}

export const defaultKeyGenerator = (() => {
  let count = 0;
  return function () {
    count++;
    return `mock-${count}`;
  };
})();

export function parsePaginatePayload<I>(payload: PaginatePayload<I>) {
  return Array.isArray(payload)
    ? {
        total: payload.length,
        data: payload,
        pageNo: 1
      }
    : payload;
}

export function equals(a: any, b: any): boolean {
  if (a === b) return true;
  if (!a || !b || (typeof a !== 'object' && typeof b !== 'object'))
    return a === b;
  if (a.prototype !== b.prototype) return false;
  const keys = Object.keys(a);
  if (keys.length !== Object.keys(b).length) return false;
  return keys.every(k => equals(a[k], b[k]));
}

// prettier-ignore
export interface CreateCRUDReducer  {
  <I, K extends Key<I>, M extends CRUDActionTypes = CRUDActionTypes>(key: K, options: CreateCRUDReducerOptions<false, M> & { prefill: false }): [CRUDState<I, false>, CRUDReducer<I, K, false, M>];
  <I, K extends Key<I>, Prefill = any, M extends CRUDActionTypes = CRUDActionTypes>(key: K, options: CreateCRUDReducerOptions<Prefill, M> & { prefill: Prefill }): [CRUDState<I, Prefill>, CRUDReducer<I, K, Prefill, M>];
  <I, K extends Key<I>, M extends CRUDActionTypes = CRUDActionTypes>(key: K, options?: CreateCRUDReducerOptions<null, M>): [CRUDState<I, null>, CRUDReducer<I, K, null, M>];
}

const insertHanlder = (from: number, to: number) => <T1, T2>(
  arr: T1[],
  ids: T2[]
) => {
  return [...arr.slice(0, from), ...ids, ...arr.slice(to)];
};

export const createCRUDReducer: CreateCRUDReducer = <
  I,
  K extends Key<I>,
  Prefill extends any = any,
  M extends CRUDActionTypes = CRUDActionTypes
>(
  key: K,
  options?: CreateCRUDReducerOptions<Prefill, M>
): [CRUDState<I, Prefill>, CRUDReducer<I, K, Prefill, M>] => {
  const defaultState: CRUDState<I, any> = {
    byIds: {},
    ids: [],
    list: [],
    pageNo: 1,
    pageSize: 10,
    total: 0,
    params: {}
  };

  const {
    prefill = null,
    keyGenerator = defaultKeyGenerator,
    actionTypes = DefaultCRUDActionTypes as M
  } = options || {};

  const reducer: CRUDReducer<I, K, Prefill, M> = (
    state = defaultState,
    action
  ) => {
    if (isAction(actionTypes, action, 'PAGINATE')) {
      return (() => {
        const {
          data,
          pageNo,
          total,
          pageSize = state.pageSize
        } = parsePaginatePayload(action.payload);

        if (prefill === false) {
          return reducer(state, { type: actionTypes['LIST'], payload: data });
        }

        const start = (pageNo - 1) * pageSize;

        const insert = insertHanlder(start, start + pageSize);

        const { list, ids, byIds } = reducer(defaultState, {
          type: actionTypes['LIST'],
          payload: data
        });

        const length = total - state.ids.length;

        return {
          ...state,
          total,
          pageNo,
          pageSize,
          byIds: {
            ...state.byIds,
            ...byIds
          },
          ids: insert(
            [
              ...state.ids,
              ...Array.from({ length }, (_, index) => keyGenerator(index))
            ],
            ids
          ),
          list: insert(
            [...state.list, ...Array.from({ length }, () => prefill)],
            list
          )
        };
      })();
    }

    if (isAction(actionTypes, action, 'LIST')) {
      return (action as List<'', I>).payload.reduce(
        (state, payload) =>
          reducer(state, { type: actionTypes['CREATE'], payload }),
        defaultState
      );
    }

    if (isAction(actionTypes, action, 'CREATE')) {
      const id = (action.payload[key] as unknown) as string;
      const pageNo = Math.ceil((state.total + 1) / state.pageSize);

      return {
        ...state,
        pageNo,
        total: state.total + 1,
        byIds: { ...state.byIds, [id]: action.payload },
        list: [...state.list, action.payload],
        ids: [...state.ids, id]
      };
    }

    if (isAction(actionTypes, action, 'UPDATE')) {
      const id = action.payload[key] as string;
      const updated = { ...state.byIds[id], ...action.payload };
      const index = state.ids.indexOf(id);
      return index === -1
        ? state
        : {
            ...state,
            byIds: { ...state.byIds, [id]: updated },
            list: [
              ...state.list.slice(0, index),
              updated,
              ...state.list.slice(index + 1)
            ]
          };
    }

    if (isAction(actionTypes, action, 'DELETE')) {
      const id = action.payload[key];
      const index = state.ids.indexOf(id);
      const byIds = { ...state.byIds };
      delete byIds[id];

      const pageNo = Math.ceil((state.total - 1) / state.pageSize);

      return {
        ...state,
        byIds,
        pageNo,
        total: state.total - 1,
        ids: removeFromArray(state.ids, index),
        list: removeFromArray(state.list, index)
      };
    }

    if (isAction(actionTypes, action, 'PARAMS')) {
      const { pageNo, pageSize, ...params } = action.payload;
      const toNum = (value: unknown, num: number) =>
        typeof value === 'undefined' || isNaN(Number(value))
          ? num
          : Number(value);

      const newPageNo = toNum(pageNo, defaultState.pageNo);
      const newPageSize = toNum(pageSize, defaultState.pageSize);
      const hasChanged = !equals(state.params, params);

      return hasChanged
        ? {
            ...defaultState,
            pageNo: newPageNo,
            pageSize: newPageSize,
            params
          }
        : { ...state, pageNo: newPageNo, pageSize: newPageSize };
    }

    if (isAction(actionTypes, action, 'RESET')) {
      return defaultState;
    }

    if (isAction(actionTypes, action, 'INSERT')) {
      const { payload, index = 0 } = action;
      const insert = insertHanlder(index, index);
      const id = (action.payload[key] as unknown) as string;
      const pageNo = Math.ceil((index + 1) / state.pageSize);

      return {
        ...state,
        pageNo,
        total: state.total + 1,
        ids: insert(state.ids, [id]),
        list: insert(state.list, [payload]),
        byIds: { ...state.byIds, [id]: payload }
      };
    }

    return state;
  };

  return [defaultState, reducer];
};

export function removeFromArray<T>(arr: T[], index: number) {
  return index < 0 ? arr : [...arr.slice(0, index), ...arr.slice(index + 1)];
}
