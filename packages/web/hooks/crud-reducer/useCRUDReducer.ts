/* eslint-disable @typescript-eslint/ban-types */

import { useReducer, useState } from 'react';
import {
  CRUDState,
  createCRUDReducer,
  CreateCRUDReducerOptions
} from './crudReducer';
import { Key, getCRUDActionsCreator, CRUDActionCreators } from './crudAction';
import { bindDispatch, Dispatched } from './bindDispatch';

export type UseCRUDReducer<
  I,
  K extends Key<I>,
  Prefill extends any = any
> = () => [CRUDState<I, Prefill>, Dispatched<CRUDActionCreators<I, K>>];

interface CreateUseCRUDReducerOps<I, Prefill>
  extends CreateCRUDReducerOptions<Prefill> {
  state?: Partial<CRUDState<I, Prefill>>;
}

// prettier-ignore
export interface CreateUseCRUDReducer  {
  <I, K extends Key<I>>(key: K, options: CreateUseCRUDReducerOps<I, false> & { prefill: false }): UseCRUDReducer<I, K, false>;
  <I, K extends Key<I>, Prefill = any>(key: K, options: CreateUseCRUDReducerOps<I, Prefill> & { prefill: Prefill }): UseCRUDReducer<I, K, Prefill>;
  <I, K extends Key<I>>(key: K, options?: CreateUseCRUDReducerOps<I, unknown>): UseCRUDReducer<I, K, null>
}

export const createUseCRUDReducer: CreateUseCRUDReducer = <I, K extends Key<I>>(
  key: K,
  { state: initialState, ...options }: CreateUseCRUDReducerOps<any, any> = {}
): UseCRUDReducer<I, K, any> => {
  const [defaultState, reducer] = createCRUDReducer<I, K, any>(key, options);
  return function useCRUDReducer() {
    const [state, dispatch] = useReducer(reducer, {
      ...defaultState,
      ...initialState
    });
    const [actions] = useState(() => {
      const [actions] = getCRUDActionsCreator<I, K>()();
      return { dispatch, ...bindDispatch(actions, dispatch) };
    });
    return [state, actions];
  };
};
