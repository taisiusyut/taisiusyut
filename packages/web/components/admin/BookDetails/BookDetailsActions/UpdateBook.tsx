import React from 'react';
import {
  useForm,
  Form,
  BookName,
  BookDescription,
  BookCategory,
  BookTags,
  BookCover
} from '@/components/admin/Books/BookForm';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import {
  BookDetailsActionDialogProps,
  bookDetailsActionCreator
} from './bookDetailsActionCreator';
import { updateBook } from '@/service';

export function UpdateBookDialog({
  book,
  ...props
}: BookDetailsActionDialogProps) {
  const [form] = useForm();
  return (
    <ConfirmDialog {...props}>
      <Form form={form} style={{ width: 500 }} initialValues={book}>
        <div style={{ display: 'flex' }}>
          <div style={{ flex: '1 1 auto' }}>
            <BookName />
            <BookCategory />
          </div>
          <div style={{ marginLeft: 15 }}>
            <BookCover />
          </div>
        </div>
        <BookDescription />
        <BookTags />
      </Form>
    </ConfirmDialog>
  );
}

export const getUpdateBookActionProps = bookDetailsActionCreator(
  'Update',
  updateBook,
  UpdateBookDialog
);
