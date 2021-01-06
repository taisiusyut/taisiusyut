import React from 'react';
import { ConfirmDialogProps, ConfirmDialog } from '@/components/ConfirmDialog';
import { Schema$Book } from '@/typings';
import { Toaster } from '@/utils/toaster';

export interface Book {
  book: Partial<Schema$Book> & Pick<Schema$Book, 'id'>;
}

export interface OnUpdate {
  onUpdate: (payload: Schema$Book) => void;
}

export interface Request {
  request: (params: { id: string }) => Promise<Schema$Book>;
}

export interface BookActionDialogProps
  extends Book,
    OnUpdate,
    ConfirmDialogProps {
  prefix: string;
}

export function BookActionDialog({
  prefix,
  request,
  book,
  onUpdate,
  ...props
}: BookActionDialogProps & Request) {
  async function onConfirm() {
    try {
      const response = await request({ id: book.id });
      Toaster.success({ message: `${prefix} book success` });
      onUpdate(response);
    } catch (error) {
      Toaster.apiError(`${prefix} book failure`, error);
    }
  }

  return (
    <ConfirmDialog {...props} title={`${prefix} Book`} onConfirm={onConfirm} />
  );
}
