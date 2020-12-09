import { useContext, useState, useEffect } from 'react';
import { defer } from 'rxjs';
import { StateContext, ActionContext } from './bookShelfProvider';
import { getBookShelf } from '@/service';
import { Toaster } from '@/utils/toaster';
import { useAuthState } from '../useAuth';

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
    if (auth.user) {
      setLoading(true);
      const subscription = defer(() => getBookShelf()).subscribe(
        books => {
          setLoading(false);
          actions.list(books);
        },
        error => {
          setLoading(false);
          Toaster.apiError(`Get book shelf failure`, error);
        }
      );

      return () => subscription.unsubscribe();
    }
  }, [auth, actions]);

  return loading;
}
