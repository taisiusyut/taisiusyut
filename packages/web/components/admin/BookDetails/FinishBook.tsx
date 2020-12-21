import React from 'react';
import { openConfirmDialog } from '@/components/ConfirmDialog';
import { finishBook } from '@/service';
import { BookStatus } from '@/typings';
import { Toaster } from '@/utils/toaster';
import classes from './BookDetails.module.scss';

interface Props {
  bookID: string;
  onSuccess?: (payload: { status: BookStatus }) => void;
}

interface OnClick {
  onClick?: (event: any) => void;
}

export function withFinishBook<P extends OnClick>(
  Component: React.ComponentType<P>
) {
  return function FinishBook({ bookID, onSuccess, ...props }: P & Props) {
    async function onConfirm() {
      try {
        await finishBook({ id: bookID });
        Toaster.success({ message: `Finish book success` });
        onSuccess && onSuccess({ status: BookStatus.Finished });
      } catch (error) {
        Toaster.apiError(`Finish book failure`, error);
      }
    }

    function handleClick() {
      openConfirmDialog({
        title: 'Finish Book',
        children: (
          <div className={classes['dialog']}>
            Finished book cannot publish pay chapter. Are you sure to finish the
            book?
          </div>
        ),
        onConfirm
      });
    }

    return <Component {...((props as unknown) as P)} onClick={handleClick} />;
  };
}
