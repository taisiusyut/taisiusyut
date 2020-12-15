import { useMemo } from 'react';
import { useRxAsync } from 'use-rx-hooks';
import { Schema$BookShelf } from '@/typings';
import { addBookToShelf, removeBookFromShelf } from '@/service';
import { Toaster } from '@/utils/toaster';
import { useBookShelf } from './useBookShelf';

export function useBookInShelfToggle(bookID: string) {
  const [state, actions] = useBookShelf();
  const { request, onSuccess, onFailure } = useMemo(() => {
    return {
      onSuccess: (payload: Schema$BookShelf | null) => {
        if (payload) {
          actions.insert({ ...payload, bookID }, 0);
        } else {
          actions.delete({ bookID });
        }
      },
      onFailure: (error: any) => {
        Toaster.apiError(`Error`, error);
      },
      request: (exist: boolean) =>
        exist
          ? addBookToShelf(bookID)
          : removeBookFromShelf(bookID).then(() => null)
    };
  }, [bookID, actions]);

  const [{ loading }, { fetch }] = useRxAsync(request, {
    defer: true,
    onSuccess,
    onFailure
  });

  return [state.ids.includes(bookID), loading, fetch] as const;
}
