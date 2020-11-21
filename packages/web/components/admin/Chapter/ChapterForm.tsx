import React, { useRef } from 'react';
import { Button } from '@blueprintjs/core';
import { ContentEditor } from '@/components/admin/ContentEditor';
import { Input } from '@/components/Input';
import { Schema$Chapter } from '@/typings';
import { createForm, FormProps, validators, FormInstance } from '@/utils/form';
import classes from './Chapter.module.scss';

export type ChapterState = Schema$Chapter;

interface Props extends FormProps<ChapterState> {
  loading?: boolean;
  wordCount?: number | null;
}

const { Form, FormItem, useForm } = createForm<ChapterState>();

export { useForm };

export function ChapterForm({ loading, wordCount, ...props }: Props) {
  const formRef = useRef<FormInstance<ChapterState>>(null);

  const contentLabel = (
    <div className={classes['content-label']}>
      Content
      <div>
        {typeof wordCount === 'number'
          ? `${wordCount} words`
          : 'calculating ...'}
      </div>
    </div>
  );

  return (
    <Form
      ref={formRef}
      validateTrigger="onSubmit"
      className={classes['chapter-content']}
      {...props}
    >
      <FormItem
        name="name"
        label="Name"
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

      <div className={classes.footer}>
        <Button
          disabled={loading}
          onClick={() => formRef.current?.resetFields()}
        >
          Reset
        </Button>
        <Button type="submit" intent="primary" loading={loading}>
          Submit
        </Button>
      </div>
    </Form>
  );
}
