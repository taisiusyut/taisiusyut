import { ReactNode, useRef } from 'react';
import { ButtonPopover } from '@/components/ButtonPopover';
import {
  ContentEditor,
  ContentEditorProps,
  ContentEditorRef
} from '@/components/admin/ContentEditor';
import classes from './Chapter.module.scss';
import { openInsertImageDialog } from './InsertImage';

interface ChapterContentEditorProps extends ContentEditorProps {
  rightElement?: ReactNode;
}

export function ChapterContentEditor({
  rightElement,
  ...props
}: ChapterContentEditorProps) {
  const editor = useRef<ContentEditorRef>(null);
  const insertImage = () => {
    openInsertImageDialog({
      onInsert: url => editor.current?.insertText(`[img]${url}[/img]`)
    });
  };

  return (
    <div className={classes['editor-container']}>
      <ContentEditor className={classes['editor']} {...props} ref={editor}>
        <div className={classes['head']}>
          <div>
            <ButtonPopover
              minimal
              icon="media"
              content="插入圖片"
              onClick={insertImage}
            />
          </div>
          {rightElement}
        </div>
      </ContentEditor>
    </div>
  );
}
