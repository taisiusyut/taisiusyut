import React from 'react';
import { openConfirmDialog } from '@/components/ConfirmDialog';
import { publishBook } from '@/service';
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

export function withPublishBook<P extends OnClick>(
  Component: React.ComponentType<P>
) {
  return function PublishBook({ bookID, onSuccess, ...props }: P & Props) {
    async function onConfirm() {
      try {
        await publishBook({ id: bookID });
        Toaster.success({ message: `Publish book success` });
        onSuccess && onSuccess({ status: BookStatus.Public });
      } catch (error) {
        Toaster.apiError(`Publish book failure`, error);
      }
    }

    function handleClick() {
      openConfirmDialog({
        title: 'Publish Book',
        children: (
          <div className={classes.dialog}>
            Only published book can visible by client. Are you sure to publish
            the book?
          </div>
        ),
        onConfirm
      });
    }

    return <Component {...((props as unknown) as P)} onClick={handleClick} />;
  };
}
