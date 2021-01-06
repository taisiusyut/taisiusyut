import React from 'react';
import { deleteBook } from '@/service';
import { BookActionDialog, BookActionDialogProps } from './BookActionDialog';
import classes from './BookActions.module.scss';

export function DeleteBookPermanentlyDialog(props: BookActionDialogProps) {
  return (
    <BookActionDialog {...props} intent="danger" request={deleteBook}>
      <div className={classes['dialog']}>
        This action cannot be undone. This will permanently delete 「
        {props.book.name}」.
      </div>
    </BookActionDialog>
  );
}
