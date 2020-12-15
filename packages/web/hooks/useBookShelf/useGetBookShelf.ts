import { useState, useEffect } from 'react';
import { defer } from 'rxjs';
import { getBookShelf } from '@/service';
import { Toaster } from '@/utils/toaster';
import { useAuthState } from '@/hooks/useAuth';
import { shelfStorage } from './bookShelfProvider';
import { useBookShelfActions } from './useBookShelf';

export function useGetBookShelf() {
  const auth = useAuthState();
  const actions = useBookShelfActions();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    switch (auth.loginStatus) {
      case 'unknown':
      case 'loading':
        actions.list(shelfStorage.get());
        break;
      case 'required': // for logout
        actions.list([]);
        break;
    }

    if (auth.user) {
      setLoading(true);
      const subscription = defer(() => getBookShelf()).subscribe(
        books => {
          const payload = books.map(data => ({
            ...data,
            bookID: data.book.id
          }));
          setLoading(false);
          actions.list(payload);
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
