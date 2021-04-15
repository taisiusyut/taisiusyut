import { ChangeEvent, useMemo, useState } from 'react';
import { EMPTY } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Checkbox } from '@blueprintjs/core';
import { ConfirmDialog, ConfirmDialogProps } from '@/components/ConfirmDialog';
import { readFileText, useFileUpload } from '@/hooks/useFileUpload';
import { createOpenOverlay } from '@/utils/openOverlay';
import { createAdminStorage } from '@/utils/storage';
import { Toaster } from '@/utils/toaster';
import classes from './Chapter.module.scss';

const openUploadNotice = createOpenOverlay(UploadNotice);
const storage = createAdminStorage('showChapterUploadNotice', true);

export const accept = [
  `.doc`,
  `.docx`,
  `application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document`,
  `text/plain`,
  'text/markdown'
];

export function UploadNotice(props: ConfirmDialogProps) {
  const [dontShow, setDontShow] = useState(false);

  return (
    <ConfirmDialog
      {...props}
      title="提示"
      icon="info-sign"
      confirmText="上傳"
      className={classes['upload-notice']}
      onClose={() => {
        if (dontShow) {
          storage.save(false);
        }
        props.onClose && props.onClose();
      }}
    >
      <ul>
        <li>
          上傳的檔案會將章節名稱和內容覆蓋，但上傳成功亦後可以透過
          <b>Ctrl + Z</b> 或 <b>⌘ + Z</b> 恢復
        </li>
        <li>可以將文字檔案拖到瀏覽器，更快捷地上傳</li>
      </ul>
      <Checkbox
        alignIndicator="left"
        checked={dontShow}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          setDontShow(event.target.checked)
        }
      >
        不再顯示
      </Checkbox>
    </ConfirmDialog>
  );
}

export function useChapterUpload() {
  const [fileUpload$, upload] = useFileUpload({ accept: accept.join(',') });

  return useMemo(() => {
    const uploadChpater = () => {
      if (storage.get()) {
        openUploadNotice({ onConfirm: async () => upload() });
      } else {
        upload();
      }
    };

    const chapterUpload$ = fileUpload$.pipe(
      switchMap(file => {
        if (file.type.startsWith(`text/`) || accept.includes(file.type)) {
          return readFileText(file);
        }

        Toaster.apiError(`upload failure`, `unknown file type`);

        return EMPTY;
      })
    );

    return { fileUpload$, chapterUpload$, uploadChpater };
  }, [fileUpload$, upload]);
}
