import React from 'react';
import { publishBook } from '@/service';
import { BookActionDialog, BookActionDialogProps } from './BookActionDialog';
import classes from './BookActions.module.scss';

export function PublishBookDialog(props: BookActionDialogProps) {
  return (
    <BookActionDialog {...props} intent="danger" request={publishBook}>
      <div className={classes['dialog']}>
        Published book cannot set to private again. Are you sure to publish the
        book 「{props.book.name}」?
      </div>
    </BookActionDialog>
  );
}
