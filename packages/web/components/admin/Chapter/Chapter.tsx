import React, { useEffect, useRef, useState } from 'react';
import { useRxAsync } from 'use-rx-hooks';
import { Subject } from 'rxjs';
import { Button, Card } from '@blueprintjs/core';
import { calcWordCount } from '@taisiusyut/server/dist/utils/calc-word-count';
import { PageHeader } from '@/components/admin/PageHeader';
import {
  ChapterType,
  Param$CreateChapter,
  Param$UpdateChapter
} from '@/typings';
import { ApiError, createChapter, updateChapter } from '@/service';
import { useGoBack } from '@/hooks/useGoBack';
import { Toaster } from '@/utils/toaster';
import { createChapterSotrage } from '@/utils/storage';
import { Schema$Chapter } from '@/typings';
import { useForm, ChapterForm, ChapterState } from './ChapterForm';
import classes from './Chapter.module.scss';

interface Props {
  bookID: string;
  chapterID?: string;
  chapter?: Schema$Chapter;
}

function request(payload: Param$CreateChapter | Param$UpdateChapter) {
  return 'chapterID' in payload
    ? updateChapter(payload)
    : createChapter(payload);
}

function isModified(a: any, b: any) {
  for (const k in a) {
    if (a[k] !== b[k]) {
      return true;
    }
  }
  return false;
}

export const chapterState$ = new Subject<Partial<ChapterState>>();

export function Chapter({ bookID, chapterID, chapter }: Props) {
  const [prefix, title, submitText, resetText] = chapterID
    ? (['Update', '編輯章節', '更新', '恢復'] as const)
    : (['Create', '新增章節', '提交', '清除'] as const);

  const [form] = useForm();

  const storageRef = useRef(
    createChapterSotrage<Partial<ChapterState> | null>(
      chapterID || bookID,
      null
    )
  );

  const [wordCount, setWordCount] = useState(0);
  const [modified, setModified] = useState(false);

  const { goBack } = useGoBack();

  const [asyncProps] = useState(() => {
    return {
      onSuccess: () => {
        storageRef.current.clear();
        goBack({ targetPath: `/admin/book/${bookID}` });
        Toaster.success({ message: `${prefix} chapter success` });
      },
      onFailure: (error: ApiError) => {
        Toaster.apiError(`${prefix} chapter failure`, error);
      }
    };
  });

  const [{ loading }, { fetch }] = useRxAsync(request, {
    ...asyncProps,
    defer: true
  });

  useEffect(() => {
    const subscription = chapterState$.subscribe(value => {
      const state = { ...form.getFieldsValue(), ...value };
      setModified(true);
      form.setFieldsValue(state);
      storageRef.current.save(state);
      setWordCount(calcWordCount(state.content || ''));
    });
    return () => subscription.unsubscribe();
  }, [form]);

  useEffect(() => {
    const cache = storageRef.current.get();
    if (chapter) {
      chapterState$.next({ ...chapter, ...cache, type: ChapterType.Free });
      setModified(isModified(cache || {}, chapter));
    }
  }, [form, chapter]);

  return (
    <Card style={{ position: 'relative' }}>
      <PageHeader title={title} targetPath={`/admin/book/${bookID}`} />

      <ChapterForm
        showPrefixField
        // for update chapter, this reset the initialValues
        key={JSON.stringify(chapter)}
        form={form}
        initialValues={chapter}
        wordCount={wordCount}
        onValuesChange={(_, state) => chapterState$.next(state)}
        onFinish={payload =>
          fetch({
            bookID,
            ...payload,
            ...(chapterID && { chapterID }),
            type: ChapterType.Free
          })
        }
      >
        <div className={classes['footer']}>
          <div className={classes['spacer']}></div>
          <Button
            disabled={loading || !modified}
            onClick={() => {
              form.resetFields();
              storageRef.current.get();
              chapterState$.next(chapter || {});
              setModified(false);
            }}
          >
            {resetText}
          </Button>
          <Button
            type="submit"
            intent="primary"
            loading={loading}
            disabled={!modified}
          >
            {submitText}
          </Button>
        </div>
      </ChapterForm>
    </Card>
  );
}
