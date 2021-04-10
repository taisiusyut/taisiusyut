import { ChangeEvent, useEffect, useState } from 'react';
import { EMPTY } from 'rxjs';
import { catchError, exhaustMap } from 'rxjs/operators';
import { ConfirmDialog, ConfirmDialogProps } from '@/components/ConfirmDialog';
import { Input } from '@/components/Input';
import { DropArea } from '@/components/DropArea';
import { useFileUpload } from '@/hooks/useFileUpload';
import { handleCloudinaryUpload } from '@/service';
import { createOpenOverlay } from '@/utils/openOverlay';
import { Toaster } from '@/utils/toaster';
import classes from './Chapter.module.scss';

interface InsertImageProps extends ConfirmDialogProps {
  onInsert?: (url: string) => void;
}

export const openInsertImageDialog = createOpenOverlay(InsertImage);

export function InsertImage({ onInsert, onClose, ...props }: InsertImageProps) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [fileUpload$, upload] = useFileUpload({ accept: 'image/*' });

  useEffect(() => {
    const subscription = fileUpload$
      .pipe(
        exhaustMap(file => {
          setLoading(true);
          return handleCloudinaryUpload({ file });
        }),
        catchError(error => {
          Toaster.apiError(`Upload image failure`, error);
          setLoading(false);
          return EMPTY;
        })
      )
      .subscribe(url => {
        onInsert && onInsert(url);
        onClose && onClose();
      });
    return () => subscription.unsubscribe();
  }, [fileUpload$, onInsert, onClose]);

  return (
    <ConfirmDialog
      {...props}
      title="插入圖片"
      onClose={onClose}
      loading={loading}
      onConfirm={async () => url && onInsert && onInsert(url)}
    >
      <Input
        placeholder="圖片網址"
        value={url}
        disabled={loading}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          setUrl(event.target.value)
        }
      />
      <div className={classes['insert-image-divider']}>
        <span>或</span>
      </div>
      <div className={classes['image-drop-area']}>
        <DropArea
          disabled={loading}
          className={classes['image-drop-area-content']}
          onClick={upload}
          onDrop={event => fileUpload$.next(event.dataTransfer.files[0])}
          text="點擊或拖放圖片到此處"
        />
      </div>
    </ConfirmDialog>
  );
}
