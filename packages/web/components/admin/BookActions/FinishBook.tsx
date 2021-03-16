import React from 'react';
import { finishBook } from '@/service';
import { BookActionDialog, BookActionDialogProps } from './BookActionDialog';
import classes from './BookActions.module.scss';

export function FinishBookDialog(props: BookActionDialogProps) {
  return (
    <BookActionDialog {...props} intent="danger" request={finishBook}>
      <div className={classes['dialog']}>
        完結的書籍無法發布付費章節，確認完結「{props.book.name}」嗎?
      </div>
    </BookActionDialog>
  );
}
