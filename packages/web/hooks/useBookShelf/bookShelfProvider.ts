import React, { useState, useReducer } from 'react';
import { Schema$BookShelf } from '@/typings';
import {
  bindDispatch,
  getCRUDActionsCreator,
  createCRUDReducer,
  CRUDActionCreators,
  CRUDState,
  Dispatched
} from '../crud-reducer';

export type BookShelf = (Schema$BookShelf | Partial<Schema$BookShelf>) & {
  bookID: string;
};

type State = CRUDState<BookShelf, false>;
type Actions = Dispatched<CRUDActionCreators<BookShelf, 'bookID'>>;

export const StateContext = React.createContext<State | undefined>(undefined);
export const ActionContext = React.createContext<Actions | undefined>(
  undefined
);

const [initialState, reducer] = createCRUDReducer<BookShelf, 'bookID'>(
  'bookID',
  { prefill: false }
);

const [crudActions] = getCRUDActionsCreator<BookShelf, 'bookID'>()();

export function BookShelfProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [actions] = useState({
    dispatch,
    ...bindDispatch(crudActions, dispatch)
  });

  return React.createElement(
    StateContext.Provider,
    { value: state },
    React.createElement(ActionContext.Provider, { value: actions }, children)
  );
}
