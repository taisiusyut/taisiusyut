import React from 'react';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { updateBook } from '@/service';
import { BookStatus } from '@/typings';
import { BookActionDialogProps, bookActionCreator } from './bookActionCreator';
import classes from './BookActions.module.scss';

export function DeleteBookDialog({ book, ...props }: BookActionDialogProps) {
  return (
    <ConfirmDialog {...props}>
      <div className={classes['dialog']}>
        Are you sure to delete the book 「{book.name}」?
      </div>
    </ConfirmDialog>
  );
}

export const getDeleteBookActionProps = bookActionCreator(
  'Delete',
  ({ id }: { id: string }) => updateBook({ id, status: BookStatus.Deleted }),
  DeleteBookDialog
);
