/* eslint-disable @typescript-eslint/ban-types */

import { useReducer, useState } from 'react';
import {
  CRUDState,
  createCRUDReducer,
  CreateCRUDReducerOptions
} from './crudReducer';
import {
  Key,
  getCRUDActionsCreator,
  CRUDActionCreators,
  DefaultCRUDActionTypes as actionTypes
} from './crudAction';
import { bindDispatch, Dispatched } from './bindDispatch';

export type UseCRUDReducer<
  I,
  K extends Key<I>,
  Prefill extends any = any
> = () => [CRUDState<I, Prefill>, Dispatched<CRUDActionCreators<I, K>>];

export interface CreateUseCRUDReducerOps<Prefill>
  extends CreateCRUDReducerOptions<Prefill> {}

// prettier-ignore
export interface CreateUseCRUDReducer  {
  <I, K extends Key<I>>(key: K, options: CreateUseCRUDReducerOps<false> & { prefill: false }): UseCRUDReducer<I, K, false>;
  <I, K extends Key<I>, Prefill = any>(key: K, options: CreateUseCRUDReducerOps<Prefill> & { prefill: Prefill }): UseCRUDReducer<I, K, Prefill>;
  <I, K extends Key<I>>(key: K, options?: CreateUseCRUDReducerOps<unknown>): UseCRUDReducer<I, K, null>
}

export const createUseCRUDReducer: CreateUseCRUDReducer = <I, K extends Key<I>>(
  key: K,
  { defaultState, ...options }: CreateUseCRUDReducerOps<any> = {}
): UseCRUDReducer<I, K, any> => {
  const [initialState, reducer] = createCRUDReducer<I, K, any>(key, {
    ...options,
    defaultState,
    actionTypes
  });

  return function useCRUDReducer() {
    const [state, dispatch] = useReducer(reducer, initialState);

    const [actions] = useState(() => {
      const [actions] = getCRUDActionsCreator<I, K>()();
      return { dispatch, ...bindDispatch(actions, dispatch) };
    });
    return [state, actions];
  };
};
