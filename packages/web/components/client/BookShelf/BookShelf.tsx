import React from 'react';
import { ClientHeader } from '@/components/client/ClientHeader';
import { ClientProfile } from '@/components/client/ClientProfile';
import { useBookShelfState, useGetBookShelf } from '@/hooks/useBookShelf';
import { BookShelfItem } from './BookShelfItem';
import { BookShelfEmpty } from './BookShelfEmpty';
import classes from './BookShelf.module.scss';

export function BookShelf() {
  const { list: books } = useBookShelfState();

  useGetBookShelf();

  return (
    <div className={classes['book-shelf']}>
      <ClientHeader title="書架" left={<ClientProfile />} />
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
