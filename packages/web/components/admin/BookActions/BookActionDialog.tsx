import React from 'react';
import { ConfirmDialogProps, ConfirmDialog } from '@/components/ConfirmDialog';
import { Schema$Book } from '@/typings';
import { Toaster } from '@/utils/toaster';

export interface Book {
  book: Partial<Schema$Book> & Pick<Schema$Book, 'id'>;
}

export interface OnSuccess {
  onSuccess: (payload?: Schema$Book) => void;
}

export interface Request {
  request: (params: { id: string }) => Promise<Schema$Book | void>;
}

export interface BookActionDialogProps
  extends Book,
    OnSuccess,
    ConfirmDialogProps {
  prefix: string;
}

export function BookActionDialog({
  prefix,
  request,
  book,
  onSuccess,
  ...props
}: BookActionDialogProps & Request) {
  async function onConfirm() {
    prefix =
      prefix.slice(0, 1).toUpperCase() +
      prefix.slice(1, prefix.length).toLowerCase();

    try {
      const response = await request({ id: book.id });
      Toaster.success({ message: `${prefix} book success` });
      onSuccess(response || undefined);
    } catch (error) {
      Toaster.apiError(`${prefix} book failure`, error);
    }
  }

  return (
    <ConfirmDialog {...props} title={`${prefix} Book`} onConfirm={onConfirm} />
  );
}
