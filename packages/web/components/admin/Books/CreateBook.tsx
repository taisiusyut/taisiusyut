import React from 'react';
import { Button, IconName } from '@blueprintjs/core';
import { openConfirmDialog } from '@/components/ConfirmDialog';
import { Schema$Book, Param$CreateBook } from '@/typings';
import { createBook } from '@/service';
import { Toaster } from '@/utils/toaster';
import {
  useForm,
  Form,
  BookName,
  BookDescription,
  BookTags,
  BookCover
} from './BookForm';

export interface OnCreate {
  onCreate: (payload: Schema$Book) => void;
}

interface CreateBookProps extends OnCreate {}

const icon: IconName = 'book';
const title = '新增書籍';

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
          <BookDescription />
        </div>
        <div style={{ marginLeft: 20 }}>
          <BookCover />
        </div>
      </div>
      <BookTags />
    </Form>
  );

  function handleClick() {
    openConfirmDialog({
      icon,
      title,
      children,
      onConfirm,
      onClosed: () => form.resetFields()
    });
  }

  return (
    <Button icon={icon} text={title} intent="primary" onClick={handleClick} />
  );
}
