import React from 'react';
import { ClientHeader } from '@/components/client/ClientHeader';
import { NavLink } from '@/components/NavLink';
import { useBookShelfState, useGetBookShelf } from '@/hooks/useBookShelf';
import { BookShelfItem } from './BookShelfItem';
import { BookShelfEmpty } from './BookShelfEmpty';
import classes from './BookShelf.module.scss';

export function BookShelf() {
  const { list: books } = useBookShelfState();

  useGetBookShelf();

  return (
    <div className={classes['book-shelf']}>
      <ClientHeader title="書架" />
      <div className={classes['book-shelf-content']}>
        {books.length ? (
          books.map(data => {
            return data.book ? (
              <NavLink key={data.id} href="" activeClassName={classes.active}>
                <BookShelfItem data={data} />
              </NavLink>
            ) : (
              <BookShelfItem key={data.id} data={data} />
            );
          })
        ) : (
          <BookShelfEmpty />
        )}
      </div>
    </div>
  );
}
