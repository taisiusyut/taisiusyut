import { useContext, useEffect, useRef } from 'react';
import { updateBookInShelf } from '@/service';
import { useAuthState } from '@/hooks/useAuth';
import { StateContext, ActionContext } from './bookShelfProvider';

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

export function useLastVisitChapter(
  bookID: string | undefined,
  chapterNo: number
) {
  const timeout = useRef(setTimeout(() => void 0, 0));
  const [shelf, actions] = useBookShelf();
  const { loginStatus } = useAuthState();

  useEffect(() => {
    if (bookID && shelf.byIds[bookID]?.lastVisit !== chapterNo) {
      clearTimeout(timeout.current);
      timeout.current = setTimeout(() => {
        const payload = { bookID, lastVisit: chapterNo };
        actions.update(payload);

        if (loginStatus === 'loggedIn') {
          updateBookInShelf(payload).catch(() => void 0);
        }
      }, 1000);
    }
  }, [chapterNo, bookID, loginStatus, actions, shelf.byIds]);
}
