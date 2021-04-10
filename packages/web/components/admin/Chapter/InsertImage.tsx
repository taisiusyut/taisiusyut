import { ChangeEvent, useEffect, useState } from 'react';
import { ConfirmDialog, ConfirmDialogProps } from '@/components/ConfirmDialog';
import { Input } from '@/components/Input';
import { DropArea } from '@/components/DropArea';
import {
  getBase64ImageURL,
  getFileFromEvent,
  useFileUpload
} from '@/hooks/useFileUpload';
import { handleCloudinaryUpload } from '@/service';
import { createOpenOverlay } from '@/utils/openOverlay';
import { Toaster } from '@/utils/toaster';
import classes from './Chapter.module.scss';
import { Button } from '@blueprintjs/core';

interface InsertImageProps extends ConfirmDialogProps {
  onInsert?: (url: string) => void;
}

export const openInsertImageDialog = createOpenOverlay(InsertImage);

function PreviewImage({ file }: { file: File }) {
  const [src, setSrc] = useState('');
  useEffect(() => {
    getBase64ImageURL(file).then(setSrc);
  }, [file]);
  return <img className={classes['preview-image']} src={src} alt="preview" />;
}

export function InsertImage({ onInsert, onClose, ...props }: InsertImageProps) {
  const [url, setUrl] = useState('');
  const [file, setFile] = useState<File>();
  const [loading, setLoading] = useState(false);
  const [fileUpload$, upload] = useFileUpload({ accept: 'image/*' });

  async function onConfirm() {
    const insert = (url: string) => {
      onInsert && onInsert(url);
      onClose && onClose();
    };
    if (file) {
      try {
        setLoading(true);
        const uploadedUrl = await handleCloudinaryUpload({ file }).toPromise();
        insert(uploadedUrl);
      } catch (error) {
        Toaster.apiError(`upload image failure`, error);
      } finally {
        setLoading(false);
      }
    } else if (url) {
      insert(url);
    }
  }

  useEffect(() => {
    fileUpload$.subscribe(file => {
      if (file.type.startsWith(`image/`)) {
        setFile(file);
      } else {
        Toaster.apiError(`upload image failure`, `invalid image format`);
      }
    });
  }, [fileUpload$]);

  return (
    <ConfirmDialog
      {...props}
      title="插入圖片"
      onClose={onClose}
      loading={loading}
      onConfirm={onConfirm}
      style={{ maxWidth: 500 }}
    >
      <Input
        placeholder="輸入圖片網址"
        value={url}
        disabled={loading}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          setUrl(event.target.value)
        }
      />
      <div className={classes['insert-image-divider']}>
        <span>或</span>
      </div>
      {file ? (
        <div className={classes['preview']}>
          <PreviewImage file={file} />
          <div className={classes['preview-control']}>
            <Button icon="cross" minimal onClick={() => setFile(undefined)} />
          </div>
        </div>
      ) : (
        <div className={classes['image-drop-area']}>
          <DropArea
            text="點擊或拖放圖片到此處"
            className={classes['image-drop-area-content']}
            onClick={upload}
            disabled={loading}
            onDrop={event => {
              fileUpload$.next(getFileFromEvent(event));
            }}
          />
        </div>
      )}
    </ConfirmDialog>
  );
}
