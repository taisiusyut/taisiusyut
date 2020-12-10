import { useContext, useState, useEffect, useMemo } from 'react';
import { defer } from 'rxjs';
import { useRxAsync } from 'use-rx-hooks';
import { Schema$BookShelf } from '@/typings';
import { addBookToShelf, getBookShelf, removeBookFromShelf } from '@/service';
import { Toaster } from '@/utils/toaster';
import { useAuthState } from '../useAuth';
import { StateContext, ActionContext } from './bookShelfProvider';

export * from './bookShelfProvider';

export function useBookShelfState() {
  const context = useContext(StateContext);
  if (context === undefined) {
    throw new Error(
      'useBookShelfState must be used within a BookShelfProvider'
    );
  }
  return context;
}

export function useBookShelfActions() {
  const context = useContext(ActionContext);
  if (context === undefined) {
    throw new Error(
      'useBookShelfActions must be used within a BookShelfProvider'
    );
  }
  return context;
}

export function useBookShelf() {
  return [useBookShelfState(), useBookShelfActions()] as const;
}

export function useGetBookShelf() {
  const auth = useAuthState();
  const actions = useBookShelfActions();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    switch (auth.loginStatus) {
      case 'unknown':
      case 'loading':
        actions.list(
          Array.from({ length: 10 }, () => ({ bookID: String(Math.random()) }))
        );
        break;
      case 'required':
        actions.list([]);
        break;
    }

    if (auth.user) {
      setLoading(true);
      const subscription = defer(() => getBookShelf()).subscribe(
        books => {
          setLoading(false);
          actions.list(books.map(data => ({ ...data, bookID: data.book.id })));
        },
        error => {
          setLoading(false);
          actions.list([]);
          Toaster.apiError(`Get book shelf failure`, error);
        }
      );
      return () => subscription.unsubscribe();
    }
  }, [auth, actions]);

  return loading;
}

export function useBookInShelfToggle(bookID: string) {
  const [state, actions] = useBookShelf();
  const { request, onSuccess } = useMemo(() => {
    return {
      onSuccess: (payload: Schema$BookShelf | null) => {
        if (payload) {
          actions.insert({ ...payload, bookID }, 0);
        } else {
          actions.delete({ bookID });
        }
      },
      request: (exist: boolean) =>
        exist
          ? addBookToShelf(bookID)
          : removeBookFromShelf(bookID).then(() => null)
    };
  }, [bookID, actions]);

  const [{ loading }, { fetch }] = useRxAsync(request, {
    defer: true,
    onSuccess
  });

  return [state.ids.includes(bookID), loading, fetch] as const;
}
