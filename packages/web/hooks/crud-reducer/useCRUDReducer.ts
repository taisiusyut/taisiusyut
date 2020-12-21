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
  Prefill extends boolean = true
> = () => [CRUDState<I, Prefill>, Dispatched<CRUDActionCreators<I, K>>];

export interface CreateUseCRUDReducerOps<I, Prefill extends boolean = true>
  extends CreateCRUDReducerOptions<Prefill> {
  initializer?: (arg: CRUDState<I, Prefill>) => CRUDState<I, Prefill>;
}

// prettier-ignore
export interface CreateUseCRUDReducer  {
  <I, K extends Key<I>>(key: K, options: CreateUseCRUDReducerOps<false> & { prefill: false }): UseCRUDReducer<I, K, false>;
  <I, K extends Key<I>>(key: K, options: CreateUseCRUDReducerOps<true>): UseCRUDReducer<I, K, true>;
  <I, K extends Key<I>>(key: K, options?: CreateUseCRUDReducerOps<boolean>): UseCRUDReducer<I, K, true>
}

export const createUseCRUDReducer: CreateUseCRUDReducer = <I, K extends Key<I>>(
  key: K,
  { initializer, ...options }: CreateUseCRUDReducerOps<any> = {}
): UseCRUDReducer<I, K, any> => {
  const [initialState, reducer] = createCRUDReducer<I, K>(key, options);

  return function useCRUDReducer() {
    const [state, dispatch] = useReducer(reducer, initialState, state =>
      initializer ? initializer(state) : state
    );

    const [actions] = useState(() => {
      const [actions] = getCRUDActionsCreator<I, K>()();
      return { dispatch, ...bindDispatch(actions, dispatch) };
    });
    return [state, actions];
  };
};
