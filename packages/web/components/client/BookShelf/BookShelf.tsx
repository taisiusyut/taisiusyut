import React, { useEffect } from 'react';
import { defer } from 'rxjs';
import { ClientHeader } from '@/components/client/ClientLayout';
import { ButtonPopover } from '@/components/ButtonPopover';
import {
  withMainMenuOverLay,
  MainMenuOverlayIcon,
  MainMenuOverlayTitle
} from '@/components/client/MainMenuOverlay';
import { useBookShelf, placeholder } from '@/hooks/useBookShelf';
import { useAuthState } from '@/hooks/useAuth';
import { getBookShelf } from '@/service';
import { Toaster } from '@/utils/toaster';
import { BookShelfItem } from './BookShelfItem';
import { BookShelfEmpty } from './BookShelfEmpty';
import classes from './BookShelf.module.scss';

const MainMenuButton = withMainMenuOverLay(ButtonPopover);

export function BookShelf() {
  const [{ list: books }, actions] = useBookShelf();
  const { loginStatus } = useAuthState();

  useEffect(() => {
    switch (loginStatus) {
      case 'loading':
        actions.list(placeholder);
        break;
      case 'required': // for logout
        actions.list([]);
        break;
      case 'loggedIn':
        const subscription = defer(() => getBookShelf()).subscribe(
          books => {
            const payload = books.map(data => ({
              ...data,
              bookID: data.book.id
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

  return (
    <div className={classes['book-shelf']}>
      <ClientHeader
        title="書架"
        left={
          <MainMenuButton
            minimal
            icon={MainMenuOverlayIcon}
            content={MainMenuOverlayTitle}
          />
        }
      />
      <div className={classes['book-shelf-content']}>
        <div className={classes['border']}></div>
        {books.length ? (
          books.map(data => <BookShelfItem key={data.bookID} data={data} />)
        ) : loginStatus === 'unknown' ? null : (
          <BookShelfEmpty />
        )}
      </div>
    </div>
  );
}
