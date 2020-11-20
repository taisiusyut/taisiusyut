import React from 'react';
import { useRxAsync } from 'use-rx-hooks';
import { Button, Card } from '@blueprintjs/core';
import { PageHeader } from '@/components/admin/PageHeader';
import { ContentEditor } from '@/components/admin/ContentEditor';
import { Input } from '@/components/Input';
import { Schema$Chapter, ChapterType } from '@/typings';
import { createChapter } from '@/service';
import { createForm, validators } from '@/utils/form';
import classes from './Chapter.module.scss';

interface Props {
  bookID: string;
  chapter?: Schema$Chapter;
}

const { Form, FormItem, useForm } = createForm<Schema$Chapter>();

// TODO: beforeunload, save local

export function Chapter({ bookID, chapter }: Props) {
  const [form] = useForm();
  const [{ loading }, { fetch }] = useRxAsync(createChapter, {
    defer: true
  });

  return (
    <Card>
      <PageHeader title="Chapter" goback={`/admin/book/${bookID}`}></PageHeader>

      <Form
        form={form}
        validateTrigger="onSubmit"
        className={classes['chapter-content']}
        key={JSON.stringify(chapter)}
        initialValues={{ type: ChapterType.Free, ...chapter }}
        onFinish={payload => fetch({ bookID, ...payload })}
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
          label="Content"
          validators={[validators.required('Please enter chapter content')]}
        >
          <ContentEditor className={classes['editor-container']} />
        </FormItem>

        <FormItem name="type" noStyle>
          <div hidden />
        </FormItem>

        <div className={classes.footer}>
          <Button disabled={loading} onClick={() => form.resetFields()}>
            Reset
          </Button>
          <Button type="submit" intent="primary" loading={loading}>
            Submit
          </Button>
        </div>
      </Form>
    </Card>
  );
}
