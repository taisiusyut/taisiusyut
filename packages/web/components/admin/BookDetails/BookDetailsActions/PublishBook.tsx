import React from 'react';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { publishBook } from '@/service';
import {
  BookDetailsActionDialogProps,
  bookDetailsActionCreator
} from './bookDetailsActionCreator';
import classes from './BookDetailsActions.module.scss';

export function PublishBookDialog({
  book,
  ...props
}: BookDetailsActionDialogProps) {
  return (
    <ConfirmDialog {...props}>
      <div className={classes['dialog']}>
        Published book cannot set to private again. Are you sure to publish the
        book 「{book.name}」?
      </div>
    </ConfirmDialog>
  );
}

export const getPublishBookActionProps = bookDetailsActionCreator(
  'Publish',
  publishBook,
  PublishBookDialog
);
