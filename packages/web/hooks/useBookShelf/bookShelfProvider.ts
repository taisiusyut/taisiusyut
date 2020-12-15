import React, { useState, useReducer, useEffect } from 'react';
import { Schema$BookShelf } from '@/typings';
import { createClientStorage } from '@/utils/storage';
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

export type BookShelfState = CRUDState<BookShelf, false>;
export type BookShelfActions = Dispatched<
  CRUDActionCreators<BookShelf, 'bookID'>
>;

export const StateContext = React.createContext<BookShelfState | undefined>(
  undefined
);
export const ActionContext = React.createContext<BookShelfActions | undefined>(
  undefined
);

const placeholder = Array.from<unknown, BookShelf>({ length: 10 }, () => ({
  bookID: String(Math.random())
}));

export const shelfStorage = createClientStorage<BookShelf[]>(
  'shelf',
  placeholder
);

const [initialState, reducer] = createCRUDReducer<BookShelf, 'bookID'>(
  'bookID',
  { prefill: false }
);

const [crudActions] = getCRUDActionsCreator<BookShelf, 'bookID'>()();

export function BookShelfProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState, state =>
    reducer(state, { type: 'LIST', payload: shelfStorage.get() })
  );
  const [actions] = useState({
    dispatch,
    ...bindDispatch(crudActions, dispatch)
  });

  useEffect(() => {
    if (state.list.length === 0) {
      shelfStorage.clear();
    } else {
      shelfStorage.save(state.list);
    }
  }, [state]);

  return React.createElement(
    StateContext.Provider,
    { value: state },
    React.createElement(ActionContext.Provider, { value: actions }, children)
  );
}
