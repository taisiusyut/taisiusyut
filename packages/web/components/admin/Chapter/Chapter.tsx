import React, { useEffect, useRef, useState } from 'react';
import router from 'next/router';
import { useRxAsync } from 'use-rx-hooks';
import { Subject, fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Button, Card, Icon } from '@blueprintjs/core';
import { PageHeader } from '@/components/admin/PageHeader';
import { ContentEditor } from '@/components/admin/ContentEditor';
import { Input } from '@/components/Input';
import { Schema$Chapter, ChapterType } from '@/typings';
import { ApiError, createChapter } from '@/service';
import { createForm, validators } from '@/utils/form';
import { createChapterSotrage } from '@/utils/storage';
import { Toaster } from '@/utils/toaster';
import classes from './Chapter.module.scss';

interface Props {
  bookID: string;
  chapter?: Schema$Chapter;
}

type ChapterState = Schema$Chapter;

const { Form, FormItem, useForm } = createForm<ChapterState>();

export const change$ = new Subject<ChapterState>();

function getWordCount(plainText: string) {
  const regex = /(?:\r\n|\r|\n|\s)/g; // new line, carriage return, line feed
  const cleanString = plainText.replace(regex, '').trim(); // replace above characters w/ space
  return cleanString.length;
}

// TODO: upload

export function Chapter({ bookID, chapter }: Props) {
  const [form] = useForm();
  const storageRef = useRef(
    createChapterSotrage<ChapterState | null>(
      chapter ? chapter.id : bookID,
      null
    )
  );

  const [saved, setSaved] = useState<Partial<ChapterState> | null>();
  const [wordCount, setWordCount] = useState<number | null>(null);

  const [{ onSuccess, onFailure }] = useState(() => {
    return {
      onSuccess: () => {
        storageRef.current.removeItem();
        Toaster.success({ message: `Create chapter success` });
        router.push(`/admin/book/${bookID}`);
      },
      onFailure: (error: ApiError) => {
        Toaster.apiError(`Create chapter failure`, error);
      }
    };
  });

  const [{ loading }, { fetch }] = useRxAsync(createChapter, {
    defer: true,
    onSuccess,
    onFailure
  });

  useEffect(() => {
    const state: Partial<ChapterState> = {
      type: ChapterType.Free,
      ...chapter,
      ...storageRef.current.get()
    };
    setSaved(state);
    setWordCount(state.content ? getWordCount(state.content) : 0);
  }, [chapter]);

  useEffect(() => {
    const storage = storageRef.current;
    const subscription = change$.pipe(debounceTime(2000)).subscribe(chapter => {
      try {
        storage.save(chapter);
        setSaved(chapter);
        setWordCount(getWordCount(chapter.content));
      } catch (error) {
        Toaster.apiError(error, `Save content failure`);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!saved && process.env.NODE_ENV === 'production') {
      const subscription = fromEvent<BeforeUnloadEvent>(
        window,
        'beforeunload'
      ).subscribe(event => {
        event.preventDefault();
        event.returnValue = 'Changes you made may not be saved.';
      });
      return () => subscription.unsubscribe();
    }
  }, [saved]);

  return (
    <Card>
      <PageHeader title="Chapter" goback={`/admin/book/${bookID}`}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {saved ? (
            <Icon icon="saved" iconSize={14}></Icon>
          ) : (
            <Icon icon="refresh" iconSize={12}></Icon>
          )}
          &nbsp;
          {saved ? 'Saved' : 'Saving...'}
        </div>
      </PageHeader>

      <Form
        form={form}
        key={JSON.stringify(chapter)}
        validateTrigger="onSubmit"
        className={classes['chapter-content']}
        initialValues={{
          type: ChapterType.Free,
          ...chapter,
          ...storageRef.current.get()
        }}
        onFinish={payload => fetch({ bookID, ...payload })}
        onValuesChange={(_, state) => {
          setSaved(null);
          setWordCount(null);
          change$.next(state);
        }}
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
          label={
            <div className={classes['content-label']}>
              Content
              <div>
                {typeof wordCount === 'number'
                  ? `${wordCount} words`
                  : 'calculating ...'}
              </div>
            </div>
          }
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
