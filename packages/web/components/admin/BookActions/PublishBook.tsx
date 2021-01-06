import React from 'react';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { publishBook } from '@/service';
import { BookActionDialogProps, bookActionCreator } from './bookActionCreator';
import classes from './BookActions.module.scss';

export function PublishBookDialog({ book, ...props }: BookActionDialogProps) {
  return (
    <ConfirmDialog {...props}>
      <div className={classes['dialog']}>
        Published book cannot set to private again. Are you sure to publish the
        book 「{book.name}」?
      </div>
    </ConfirmDialog>
  );
}

export const getPublishBookActionProps = bookActionCreator(
  'Publish',
  publishBook,
  PublishBookDialog
);
