import React from 'react';
import { Button, IconName } from '@blueprintjs/core';
import { openConfirmDialog } from '@/components/ConfirmDialog';
import { Schema$Book, Param$CreateBook, Category } from '@/typings';
import { createBook } from '@/service';
import { Toaster } from '@/utils/toaster';
import { rid } from '@/utils/rid';
import {
  useForm,
  Form,
  BookName,
  BookDescription,
  BookCategory,
  BookTags,
  BookCover
} from './BookForm';

export interface OnCreate {
  onCreate: (payload: Schema$Book) => void;
}

interface CreateBookProps extends OnCreate {}

const icon: IconName = 'book';
const title = '新增書籍';

//The maximum is inclusive and the minimum is inclusive
const getRandomIntInclusive = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export function CreateBook({ onCreate }: CreateBookProps) {
  const [form] = useForm();

  async function onConfirm() {
    const payload = await form.validateFields();
    try {
      const book = await createBook(payload as Param$CreateBook);
      onCreate(book);
      Toaster.success({ message: 'Create book success' });
    } catch (error) {
      Toaster.apiError('Create book failure', error);
      throw error;
    }
  }

  const children = (
    <Form form={form} style={{ width: 500 }}>
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
      icon,
      title,
      children,
      onConfirm,
      onClosed: () => form.resetFields(),
      onOpening: () => {
        process.env.NODE_ENV === 'development' &&
          form.setFieldsValue({
            name: rid(8),
            description: `${rid(10)}\n${rid(20)}\n${rid(30)}`,
            category: Category['玄幻'],
            tags: Array.from({ length: getRandomIntInclusive(0, 5) }, () =>
              rid(getRandomIntInclusive(4, 8))
            )
          });
      }
    });
  }

  return (
    <Button icon={icon} text={title} intent="primary" onClick={handleClick} />
  );
}
