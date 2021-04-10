import React, { useEffect, useRef } from 'react';
import { EMPTY } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Input } from '@/components/Input';
import { ButtonPopover } from '@/components/ButtonPopover';
import {
  ContentEditor,
  ContentEditorRef
} from '@/components/admin/ContentEditor';
import { Schema$Chapter } from '@/typings';
import { Max_Chapter_Name } from '@/constants';
import { createForm, FormInstance, FormProps, validators } from '@/utils/form';
import { Toaster } from '@/utils/toaster';
import { readFileText, useFileUpload } from '@/hooks/useFileUpload';
import { ChapterDropArea } from './ChapterDropArea';
import { openInsertImageDialog } from './InsertImage';
import classes from './Chapter.module.scss';

export type ChapterState = Schema$Chapter;

interface Props extends FormProps<ChapterState> {
  wordCount?: number | null;
}

const { Form, FormItem, useForm } = createForm<ChapterState>();

export { useForm };

const accept = [
  `.doc`,
  `.docx`,
  `application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document`,
  `text/plain`
].join(',');

export function ChapterForm({ wordCount, children, ...props }: Props) {
  const editor = useRef<ContentEditorRef>(null);
  const formRef = useRef<FormInstance<ChapterState>>(null);
  const [fileUpload$, upload] = useFileUpload({ accept });

  useEffect(() => {
    const subscription = fileUpload$
      .pipe(
        switchMap(file => {
          if (!file.type || accept.includes(file.type)) {
            return readFileText(file);
          } else {
            Toaster.apiError(`upload failure`, `unknown file type`);
          }
          return EMPTY;
        })
      )
      .subscribe(value => {
        formRef.current?.setFieldsValue(value);
      });
    return () => subscription.unsubscribe();
  }, [fileUpload$]);

  return (
    <Form
      ref={formRef}
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
        className={classes['editor-container']}
      >
        <ContentEditor className={classes['editor']} ref={editor}>
          <div className={classes['head']}>
            <div>
              <ButtonPopover
                minimal
                icon="upload"
                content="上傳文字檔案"
                onClick={upload}
              />
              <ButtonPopover
                minimal
                icon="media"
                content="插入圖片"
                onClick={() =>
                  openInsertImageDialog({
                    onInsert: (url: string) => {
                      editor.current?.insertText(`[img]${url}[/img]`);
                    }
                  })
                }
              />
            </div>
            <div>{typeof wordCount === 'number' ? `${wordCount} 字` : ''}</div>
          </div>
        </ContentEditor>
      </FormItem>

      {children}

      <ChapterDropArea onDrop={file => fileUpload$.next(file)} />
    </Form>
  );
}
