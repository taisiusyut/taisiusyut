import React from 'react';
import { openConfirmDialog } from '@/components/ConfirmDialog';
import { finishBook } from '@/service';
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

export function withFinishBook<P extends OnClick>(
  Component: React.ComponentType<P>
) {
  return function FinishBook({ book, onUpdate, ...props }: P & Props) {
    async function onConfirm() {
      try {
        const response = await finishBook({ id: book.id });
        Toaster.success({ message: `Finish book success` });
        onUpdate && onUpdate(response);
      } catch (error) {
        Toaster.apiError(`Finish book failure`, error);
      }
    }

    function handleClick() {
      openConfirmDialog({
        title: 'Finish Book',
        intent: 'danger',
        children: (
          <div className={classes['dialog']}>
            Finished book cannot publish paid chapter. Are you sure to finish
            the book 「{book.name}」?
          </div>
        ),
        onConfirm
      });
    }

    return <Component {...((props as unknown) as P)} onClick={handleClick} />;
  };
}
