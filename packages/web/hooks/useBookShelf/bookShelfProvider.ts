import React, { useEffect } from 'react';
import { defer } from 'rxjs';
import { useAuthState } from '@/hooks/useAuth';
import { getBookShelf } from '@/service';
import { Schema$BookShelf, Order } from '@/typings';
import { Toaster } from '@/utils/toaster';
import { createUseCRUDReducer } from '@/hooks/crud-reducer';

export type BookShelf = (Schema$BookShelf | Partial<Schema$BookShelf>) & {
  bookID: string;
};

type UseCURD = ReturnType<typeof useCRUDReducer>;
export type BookShelfState = UseCURD[0];
export type BookShelfActions = UseCURD[1];

export const StateContext = React.createContext<BookShelfState | undefined>(
  undefined
);
export const ActionContext = React.createContext<BookShelfActions | undefined>(
  undefined
);

export const placeholder = Array.from<unknown, BookShelf>(
  { length: 10 },
  () => ({ bookID: String(Math.random()) })
);

const useCRUDReducer = createUseCRUDReducer<BookShelf, 'bookID'>('bookID', {
  prefill: false
});

export function BookShelfProvider({ children }: { children: React.ReactNode }) {
  const { loginStatus } = useAuthState();
  const [state, actions] = useCRUDReducer();

  useEffect(() => {
    switch (loginStatus) {
      case 'loading':
        actions.list(placeholder);
        break;
      case 'required': // for logout
        actions.list([]);
        break;
      case 'loggedIn':
        const subscription = defer(() =>
          getBookShelf({ sort: { updatedAt: Order.DESC } })
        ).subscribe(
          books => {
            const payload = books.map(data => ({
              ...data,
              bookID: data.book?.id || data.id
            }));
            actions.list(payload);
          },
          error => {
            actions.list([]);
            Toaster.apiError(`Get book shelf failure`, error);
          }
        );
        return () => subscription.unsubscribe();
    }
  }, [loginStatus, actions]);

  return React.createElement(
    StateContext.Provider,
    { value: state },
    React.createElement(ActionContext.Provider, { value: actions }, children)
  );
}
