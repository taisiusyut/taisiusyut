import React from 'react';
import { Input } from '@/components/Input';
import { Schema$Chapter } from '@/typings';
import { Max_Chapter_Name } from '@/constants';
import { createForm, FormProps, validators } from '@/utils/form';
import { ChapterContentEditor } from './ChapterContentEditor';
import classes from './Chapter.module.scss';

export type ChapterState = Schema$Chapter;

interface Props extends FormProps<ChapterState> {
  wordCount?: number | null;
}

const { Form, FormItem, useForm } = createForm<ChapterState>();

export { useForm };

export function ChapterForm({ wordCount, children, ...props }: Props) {
  return (
    <Form
      validateTrigger="onSubmit"
      className={classes['chapter-content']}
      {...props}
    >
      <FormItem name="type" noStyle>
        <div hidden />
      </FormItem>

      <FormItem
        name="name"
        label="名稱"
        validators={[
          validators.required('Please enter a chapter name'),
          validators.maxLength(
            Max_Chapter_Name,
            `cannot longer then ${Max_Chapter_Name}`
          )
        ]}
      >
        <Input />
      </FormItem>

      <FormItem
        name="content"
        label="內容"
        validators={[validators.required('Please enter chapter content')]}
      >
        <ChapterContentEditor
          rightElement={
            <div>{typeof wordCount === 'number' ? `${wordCount} 字` : ''}</div>
          }
        />
      </FormItem>

      {children}
    </Form>
  );
}
