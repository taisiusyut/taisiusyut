import React from 'react';
import { openConfirmDialog } from '@/components/ConfirmDialog';
import {
  useForm,
  Form,
  BookName,
  BookDescription,
  BookCategory,
  BookTags,
  BookCover
} from '@/components/admin/Books/BookForm';
import { updateBook } from '@/service';
import { Toaster } from '@/utils/toaster';
import { Schema$Book } from '@/typings';

interface Props {
  book: Partial<Schema$Book> & Pick<Schema$Book, 'id'>;
  onUpdate?: (payload: Schema$Book) => void;
}

interface OnClick {
  onClick?: (event: React.MouseEvent<any>) => void;
}

export function withUpdateBook<P extends OnClick>(
  Component: React.ComponentType<P>
) {
  return function UpdateBook({ book, onUpdate, ...props }: P & Props) {
    const [form] = useForm();

    async function onConfirm() {
      const payload = await form.validateFields();
      try {
        const response = await updateBook({ ...payload, id: book.id });
        Toaster.success({ message: `Update book success` });
        onUpdate && onUpdate(response);
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
