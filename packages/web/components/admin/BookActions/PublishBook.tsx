import React from 'react';
import { publishBook } from '@/service';
import { BookActionDialog, BookActionDialogProps } from './BookActionDialog';
import classes from './BookActions.module.scss';

export function PublishBookDialog(props: BookActionDialogProps) {
  return (
    <BookActionDialog {...props} intent="danger" request={publishBook}>
      <div className={classes['dialog']}>
        書籍發佈後，無法再隱藏書籍，確認發佈「{props.book.name}」嗎?
      </div>
    </BookActionDialog>
  );
}
