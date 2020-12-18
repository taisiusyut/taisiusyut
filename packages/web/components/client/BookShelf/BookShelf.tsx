import React from 'react';
import { ClientHeader } from '@/components/client/ClientLayout';
import { ButtonPopover } from '@/components/ButtonPopover';
import {
  withMainMenuOverLay,
  MainMenuOverlayIcon,
  MainMenuOverlayTitle
} from '@/components/client/MainMenuOverlay';
import { useBookShelfState, useGetBookShelf } from '@/hooks/useBookShelf';
import { BookShelfItem } from './BookShelfItem';
import { BookShelfEmpty } from './BookShelfEmpty';
import classes from './BookShelf.module.scss';

const MainMenuButton = withMainMenuOverLay(ButtonPopover);

export function BookShelf() {
  const { list: books } = useBookShelfState();

  useGetBookShelf();

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
        {books.length ? (
          books.map(data => <BookShelfItem key={data.bookID} data={data} />)
        ) : (
          <BookShelfEmpty />
        )}
      </div>
    </div>
  );
}
