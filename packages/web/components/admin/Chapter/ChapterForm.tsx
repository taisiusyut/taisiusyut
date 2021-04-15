import React, { useEffect, useRef } from 'react';
import { Input } from '@/components/Input';
import { ButtonPopover } from '@/components/ButtonPopover';
import {
  ContentEditor,
  ContentEditorRef
} from '@/components/admin/ContentEditor';
import { Schema$Chapter } from '@/typings';
import { Max_Chapter_Name, Max_Chapter_Prefix } from '@/constants';
import { createForm, FormInstance, FormProps, validators } from '@/utils/form';
import { ChapterDropArea } from './ChapterDropArea';
import { openInsertImageDialog } from './InsertImage';
import { useChapterUpload } from './ChapterUpload';
import classes from './Chapter.module.scss';

export type ChapterState = Schema$Chapter;

interface Props extends FormProps<ChapterState> {
  wordCount?: number | null;
  showPrefixField?: boolean;
}

const { Form, FormItem, useForm } = createForm<ChapterState>();

export { useForm };

export function ChapterForm({
  wordCount,
  children,
  showPrefixField,
  ...props
}: Props) {
  const editor = useRef<ContentEditorRef>(null);
  const formRef = useRef<FormInstance<ChapterState>>(null);
  const { fileUpload$, chapterUpload$, uploadChpater } = useChapterUpload();

  useEffect(() => {
    const subscription = chapterUpload$.subscribe(value => {
      formRef.current?.setFieldsValue(value);
    });
    return () => subscription.unsubscribe();
  }, [chapterUpload$]);

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

      {showPrefixField && (
        <FormItem
          name="prefix"
          label="前綴 (可選)"
          validators={[
            validators.maxLength(
              Max_Chapter_Prefix,
              `cannot longer then ${Max_Chapter_Prefix}`
            )
          ]}
        >
          <Input placeholder="章節名稱前綴，默認顯示「第X章」，可輸入「序章」/「楔子」等等" />
        </FormItem>
      )}

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
                onClick={uploadChpater}
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
