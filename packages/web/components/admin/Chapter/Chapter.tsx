import React, { useEffect, useState } from 'react';
import { useRxAsync } from 'use-rx-hooks';
import { switchMap } from 'rxjs/operators';
import { Button, Card, Icon } from '@blueprintjs/core';
import { PageHeader } from '@/components/admin/PageHeader';
import {
  ChapterType,
  Param$CreateChapter,
  Param$UpdateChapter
} from '@/typings';
import { ApiError, createChapter, updateChapter } from '@/service';
import { useGoBack } from '@/hooks/useGoBack';
import { Toaster } from '@/utils/toaster';
import {
  getFileFromEvent,
  readFileText,
  useFileUpload
} from '@/hooks/useFileUpload';
import { useBoolean } from '@/hooks/useBoolean';
import { useChapterStat, ChapterStatProps } from './useChapterStat';
import { useForm, ChapterForm } from './ChapterForm';
import { ChapterDropArea } from './ChapterDropArea';
import classes from './Chapter.module.scss';

interface Props extends ChapterStatProps {}

function request(payload: Param$CreateChapter | Param$UpdateChapter) {
  return 'chapterID' in payload
    ? updateChapter(payload)
    : createChapter(payload);
}

export function Chapter({ bookID, chapterID, chapter }: Props) {
  const prefix = chapterID ? 'Update' : 'Create';
  const [title, submitText] = chapterID
    ? ['更新章節', '更新']
    : ['新增章節', '確認'];

  const [form] = useForm();

  const { saved, wordCount, onChange, storage } = useChapterStat({
    bookID,
    chapterID,
    chapter
  });

  const { goBack } = useGoBack();

  const [asyncProps] = useState(() => {
    return {
      onSuccess: () => {
        storage.clear();
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

  const [fileUpload$, upload] = useFileUpload();
  const [dropArea, dragOver, dragEnd] = useBoolean();

  useEffect(() => {
    const subscription = fileUpload$
      .pipe(switchMap(file => readFileText(file)))
      .subscribe(value => {
        form.setFieldsValue(value);
        onChange(value);
      });
    return () => subscription.unsubscribe();
  }, [fileUpload$, form, onChange]);

  useEffect(() => {
    form.setFieldsValue({
      type: ChapterType.Free,
      ...chapter,
      ...storage.get()
    });
  }, [form, chapter, storage]);

  return (
    <Card style={{ position: 'relative' }} onDragOver={dragOver}>
      <PageHeader title={title} targetPath={`/admin/book/${bookID}`}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {saved ? (
            <Icon icon="saved" iconSize={14}></Icon>
          ) : (
            <Icon icon="refresh" iconSize={12}></Icon>
          )}
          &nbsp;
          {saved ? '已儲存' : '儲存中...'}
        </div>
      </PageHeader>

      <ChapterForm
        // for update chapter, this reset the initialValues
        key={JSON.stringify(chapter)}
        form={form}
        wordCount={wordCount}
        onValuesChange={(_, state) => onChange(state)}
        onFinish={payload =>
          fetch({ bookID, ...payload, ...(chapterID && { chapterID }) })
        }
      >
        <div className={classes['footer']}>
          <Button minimal icon="upload" text="上傳" onClick={upload} />
          <div className={classes['spacer']}></div>
          <Button
            disabled={loading}
            onClick={() => {
              onChange({});
              form.resetFields(['name', 'content']);
            }}
          >
            重設
          </Button>
          <Button type="submit" intent="primary" loading={loading}>
            {submitText}
          </Button>
        </div>
      </ChapterForm>

      <ChapterDropArea
        usePortal={false}
        isOpen={dropArea}
        onClose={dragEnd}
        onDrop={event => {
          dragEnd();
          fileUpload$.next(getFileFromEvent(event));
        }}
      />
    </Card>
  );
}
