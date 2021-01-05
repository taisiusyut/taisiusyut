import React from 'react';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { finishBook } from '@/service';
import {
  BookDetailsActionDialogProps,
  bookDetailsActionCreator
} from './bookDetailsActionCreator';
import classes from './BookDetailsActions.module.scss';

export function FinishBookDialog({
  book,
  ...props
}: BookDetailsActionDialogProps) {
  return (
    <ConfirmDialog {...props}>
      <div className={classes['dialog']}>
        Finished book cannot publish paid chapter. Are you sure to finish the
        book 「{book.name}」?
      </div>
    </ConfirmDialog>
  );
}

export const getFinishBookActionProps = bookDetailsActionCreator(
  'Finish',
  finishBook,
  FinishBookDialog
);
