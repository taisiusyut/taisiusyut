import React from 'react';
import { ContentEditor } from '@/components/admin/ContentEditor';
import { Input } from '@/components/Input';
import { Schema$Chapter } from '@/typings';
import { createForm, FormProps, validators } from '@/utils/form';
import classes from './Chapter.module.scss';

export type ChapterState = Schema$Chapter;

interface Props extends FormProps<ChapterState> {
  wordCount?: number | null;
}

const { Form, FormItem, useForm } = createForm<ChapterState>();

export { useForm };

export function ChapterForm({ wordCount, children, ...props }: Props) {
  const contentLabel = (
    <div className={classes['content-label']}>
      內容
      <div>
        {typeof wordCount === 'number' ? `${wordCount} 字` : '計算中...'}
      </div>
    </div>
  );

  return (
    <Form
      validateTrigger="onSubmit"
      className={classes['chapter-content']}
      {...props}
    >
      <FormItem
        name="name"
        label="名稱"
        validators={[validators.required('Please enter a chapter name')]}
      >
        <Input />
      </FormItem>

      <FormItem
        name="content"
        label={contentLabel}
        validators={[validators.required('Please enter chapter content')]}
      >
        <ContentEditor className={classes['editor-container']} />
      </FormItem>

      <FormItem name="type" noStyle>
        <div hidden />
      </FormItem>

      {children}
    </Form>
  );
}
