import React from 'react';
import { openConfirmDialog } from '@/components/ConfirmDialog';
import { publishBook } from '@/service';
import { Schema$Book } from '@/typings';
import { Toaster } from '@/utils/toaster';
import classes from './BookDetailsActions.module.scss';

interface Props {
  book: Partial<Schema$Book> & Pick<Schema$Book, 'id'>;
  onUpdate?: (payload: Schema$Book) => void;
}

interface OnClick {
  onClick?: (event: React.MouseEvent<any>) => void;
}

export function withPublishBook<P extends OnClick>(
  Component: React.ComponentType<P>
) {
  return function PublishBook({ book, onUpdate, ...props }: P & Props) {
    async function onConfirm() {
      try {
        const response = await publishBook({ id: book.id });
        Toaster.success({ message: `Publish book success` });
        onUpdate && onUpdate(response);
      } catch (error) {
        Toaster.apiError(`Publish book failure`, error);
      }
    }

    function handleClick() {
      openConfirmDialog({
        title: 'Publish Book',
        children: (
          <div className={classes['dialog']}>
            Published book cannot set to private again. Are you sure to publish
            the book 「{book.name}」?
          </div>
        ),
        onConfirm
      });
    }

    return <Component {...((props as unknown) as P)} onClick={handleClick} />;
  };
}
