import React from 'react';
import { ClientHeader } from '@/components/client/ClientHeader';
import classes from './BookShelf.module.scss';

export function BookShelf() {
  return (
    <div className={classes['book-shelf']}>
      <ClientHeader title="書架" />
    </div>
  );
}
