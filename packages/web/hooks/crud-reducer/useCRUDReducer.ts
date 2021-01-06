/* eslint-disable @typescript-eslint/ban-types */

import { useReducer, useState } from 'react';
import {
  CRUDState,
  createCRUDReducer,
  CreateCRUDReducerOptions,
  CRUDReducer
} from './crudReducer';
import {
  Key,
  getCRUDActionsCreator,
  CRUDActionCreators,
  CRUDActionTypes,
  AllowedNames
} from './crudAction';
import { bindDispatch, Dispatched } from './bindDispatch';

export type UseCRUDReducer<
  I,
  K extends Key<I>,
  Prefill extends boolean = true
> = () => [CRUDState<I, Prefill>, Dispatched<CRUDActionCreators<I, K>>];

export interface CreateUseCRUDReducerOps<
  I,
  K extends AllowedNames<I, string>,
  Prefill extends boolean = true
> extends CreateCRUDReducerOptions<Prefill> {
  initializer?: (
    initialState: CRUDState<I, Prefill>,
    reducer: CRUDReducer<I, K, Prefill, CRUDActionTypes>
  ) => CRUDState<I, Prefill>;
}

// prettier-ignore
export interface CreateUseCRUDReducer  {
  <I, K extends Key<I>>(key: K, options: CreateUseCRUDReducerOps<I, K,false> & { prefill: false }): UseCRUDReducer<I, K, false>;
  <I, K extends Key<I>>(key: K, options: CreateUseCRUDReducerOps<I, K,true>): UseCRUDReducer<I, K, true>;
  <I, K extends Key<I>>(key: K, options?: CreateUseCRUDReducerOps<I, K,boolean>): UseCRUDReducer<I, K, true>
}

export const createUseCRUDReducer: CreateUseCRUDReducer = <I, K extends Key<I>>(
  key: K,
  { initializer, ...options }: CreateUseCRUDReducerOps<I, K, boolean> = {}
): UseCRUDReducer<I, K, boolean> => {
  const [initialState, reducer] = createCRUDReducer<I, K>(key, options);

  return function useCRUDReducer() {
    const [state, dispatch] = useReducer(reducer, initialState, state =>
      initializer ? initializer(state, reducer) : state
    );

    const [actions] = useState(() => {
      const [actions] = getCRUDActionsCreator<I, K>()();
      return { dispatch, ...bindDispatch(actions, dispatch) };
    });
    return [state, actions];
  };
};
