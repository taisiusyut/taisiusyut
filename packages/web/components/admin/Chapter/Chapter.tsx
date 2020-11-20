import React from 'react';
import { useRxAsync } from 'use-rx-hooks';
import { Button, Card, H4 } from '@blueprintjs/core';
import { Input } from '@/components/Input';
import { Schema$Chapter, ChapterType } from '@/typings';
import { createChapter } from '@/service';
import { createForm, validators } from '@/utils/form';
import { ChapterContentEditor } from './ChapterContentEditor';
import classes from './Chapter.module.scss';

interface Props {
  bookID: string;
  chapter?: Schema$Chapter;
}

const { Form, FormItem, useForm } = createForm<Schema$Chapter>();

export function Chapter({ bookID, chapter }: Props) {
  const [form] = useForm();
  const [{ loading }, { fetch }] = useRxAsync(createChapter, {
    defer: true
  });

  return (
    <Card>
      <H4>Chapter</H4>

      <Form
        form={form}
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
          <ChapterContentEditor />
        </FormItem>

        <FormItem name="type" label="Type">
          <div />
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
