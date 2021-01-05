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

export interface BookDetailsActionDialogProps
  extends Book,
    ConfirmDialogProps {}

export interface BookDetailsActionProps {
  text: string;
  onClick: () => void;
}

export type GetBookDetailsActionProps = (
  payload: Omit<BookDetailsActionDialogProps, keyof ConfirmDialogProps> &
    Partial<ConfirmDialogProps> &
    OnUpdate
) => BookDetailsActionProps;

export function bookDetailsActionCreator(
  prefix: string,
  request: (params: { id: string }) => Promise<Schema$Book>,
  Component: React.ComponentType<BookDetailsActionDialogProps>
): GetBookDetailsActionProps {
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
