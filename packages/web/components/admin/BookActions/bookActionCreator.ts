import React from 'react';
import { ConfirmDialogProps } from '@/components/ConfirmDialog';
import { Schema$Book } from '@/typings';
import { Toaster } from '@/utils/toaster';
import { createOpenOverlay } from '@/utils/openOverlay';

export interface Book {
  book: Partial<Schema$Book> & Pick<Schema$Book, 'id'>;
}

export interface OnUpdate {
  onUpdate: (payload: Schema$Book) => void;
}

export interface BookActionDialogProps extends Book, ConfirmDialogProps {}

export interface BookActionProps {
  text: string;
  onClick: () => void;
}

export type GetBookActionProps = (
  payload: Omit<BookActionDialogProps, keyof ConfirmDialogProps> &
    Partial<ConfirmDialogProps> &
    OnUpdate
) => BookActionProps;

export function bookActionCreator(
  prefix: string,
  request: (params: { id: string }) => Promise<Schema$Book>,
  Component: React.ComponentType<BookActionDialogProps>
): GetBookActionProps {
  const title = `${prefix} Book`;
  const opener = createOpenOverlay(Component);
  return function method({ onUpdate, ...payload }) {
    async function onConfirm() {
      try {
        const response = await request({ id: payload.book.id });
        Toaster.success({ message: `${prefix} book success` });
        onUpdate(response);
      } catch (error) {
        Toaster.apiError(`${prefix} book failure`, error);
      }
    }
    return {
      text: title,
      onClick: () => opener({ ...payload, title, onConfirm })
    };
  };
}
