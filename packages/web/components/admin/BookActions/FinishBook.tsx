import React from 'react';
import { finishBook } from '@/service';
import { BookActionDialog, BookActionDialogProps } from './BookActionDialog';
import classes from './BookActions.module.scss';

export function FinishBookDialog(props: BookActionDialogProps) {
  return (
    <BookActionDialog {...props} intent="danger" request={finishBook}>
      <div className={classes['dialog']}>
        Finished book cannot publish paid chapter. Are you sure to finish the
        book 「{props.book.name}」?
      </div>
    </BookActionDialog>
  );
}
