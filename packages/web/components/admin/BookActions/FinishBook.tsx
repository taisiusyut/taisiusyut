import React from 'react';
import { finishBook } from '@/service';
import { BookActionDialog, BookActionDialogProps } from './BookActionDialog';
import classes from './BookActions.module.scss';

export function FinishBookDialog(props: BookActionDialogProps) {
  return (
    <BookActionDialog {...props} intent="danger" request={finishBook}>
      <div className={classes['dialog']}>
        你確認要完結「{props.book.name}」嗎?
      </div>
    </BookActionDialog>
  );
}
