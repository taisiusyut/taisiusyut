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

// prettier-ignore
export interface CreateUseCRUDReducer  {
  <I, K extends Key<I>>(key: K, options: CreateCRUDReducerOptions & { prefill: false }): UseCRUDReducer<I, K, false>;
  <I, K extends Key<I>>(key: K, options?: CreateCRUDReducerOptions): UseCRUDReducer<I, K, true>;
  <I, K extends Key<I>>(key: K, options?: CreateCRUDReducerOptions): UseCRUDReducer<I, K, boolean>
}

export const createUseCRUDReducer: CreateUseCRUDReducer = <I, K extends Key<I>>(
  key: K,
  options?: CreateCRUDReducerOptions
): UseCRUDReducer<I, K, boolean> => {
  const [intialState, reducer] = createCRUDReducer<I, K>(key, options);
  return function useCRUDReducer() {
    const [state, dispatch] = useReducer(reducer, intialState);
    const [actions] = useState(() => {
      const [actions] = getCRUDActionsCreator<I, K>()();
      return { dispatch, ...bindDispatch(actions, dispatch) };
    });
    return [state, actions];
  };
};
