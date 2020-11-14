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

// prettier-ignore
export interface CreateUseCRUDReducer  {
  <I, K extends Key<I>>(key: K, options: CreateCRUDReducerOptions<false> & { prefill: false }): UseCRUDReducer<I, K, false>;
  <I, K extends Key<I>, Prefill = any>(key: K, options: CreateCRUDReducerOptions<Prefill> & { prefill: Prefill }): UseCRUDReducer<I, K, Prefill>;
  <I, K extends Key<I>>(key: K, options?: CreateCRUDReducerOptions): UseCRUDReducer<I, K, null>
}

export const createUseCRUDReducer: CreateUseCRUDReducer = <I, K extends Key<I>>(
  key: K,
  options?: CreateCRUDReducerOptions<any, any>
): UseCRUDReducer<I, K, any> => {
  const [intialState, reducer] = createCRUDReducer<I, K, any>(key, options);
  return function useCRUDReducer() {
    const [state, dispatch] = useReducer(reducer, intialState);
    const [actions] = useState(() => {
      const [actions] = getCRUDActionsCreator<I, K>()();
      return { dispatch, ...bindDispatch(actions, dispatch) };
    });
    return [state, actions];
  };
};
