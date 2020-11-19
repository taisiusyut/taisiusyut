import React from 'react';
import { openConfirmDialog } from '@/components/ConfirmDialog';
import { updateBook } from '@/service';
import { Toaster } from '@/utils/toaster';
import { Schema$Book } from '@/typings';
import {
  useForm,
  Form,
  BookName,
  BookDescription,
  BookCategory,
  BookTags,
  BookCover
} from '../Books/BookForm';

interface Props {
  bookID: string;
  book: Partial<Schema$Book>;
  onUpdate?: (payload: Schema$Book) => void;
}

interface OnClick {
  onClick?: (event: any) => void;
}

export function withUpdateBook<P extends OnClick>(
  Component: React.ComponentType<P>
) {
  return function UpdateBook({ bookID, book, onUpdate, ...props }: P & Props) {
    const [form] = useForm();

    async function onConfirm() {
      const payload = await form.validateFields();
      try {
        const book = await updateBook({ ...payload, id: bookID });
        Toaster.success({ message: `Update book success` });
        onUpdate && onUpdate(book);
      } catch (error) {
        Toaster.apiError(`Update book failure`, error);
      }
    }

    const children = (
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
    );

    function handleClick() {
      openConfirmDialog({
        title: 'Update Book',
        children: children,
        onConfirm
      });
    }

    return <Component {...((props as unknown) as P)} onClick={handleClick} />;
  };
}
