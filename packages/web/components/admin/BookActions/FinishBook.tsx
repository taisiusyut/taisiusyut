import React from 'react';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { finishBook } from '@/service';
import { BookActionDialogProps, bookActionCreator } from './bookActionCreator';
import classes from './BookActions.module.scss';

export function FinishBookDialog({ book, ...props }: BookActionDialogProps) {
  return (
    <ConfirmDialog {...props}>
      <div className={classes['dialog']}>
        Finished book cannot publish paid chapter. Are you sure to finish the
        book 「{book.name}」?
      </div>
    </ConfirmDialog>
  );
}

export const getFinishBookActionProps = bookActionCreator(
  'Finish',
  finishBook,
  FinishBookDialog
);
