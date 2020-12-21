import React, {
  useRef,
  useEffect,
  ChangeEvent,
  ClipboardEvent,
  DragEvent
} from 'react';
import Image from 'next/image';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  fromDropImageEvent,
  fromChangeEvent,
  RxFileToImageState,
  useRxFileToImage
} from 'use-rx-hooks';
import { Control } from '@/utils/form';
import classes from './Books.module.scss';

type UploadEvent = ChangeEvent | ClipboardEvent | DragEvent;

function mapEvent(event: UploadEvent) {
  if (event.type === 'drop') {
    return fromDropImageEvent(event as DragEvent);
  }
  return fromChangeEvent(event as ChangeEvent<HTMLInputElement>);
}

const upload = new Subject<UploadEvent>();
const upload$ = upload.pipe(map(mapEvent));

export function BookCoverUpload(
  props: Control<RxFileToImageState | string | null>
) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const state$ = useRxFileToImage(upload$);
  const { value, onChange } = props;

  useEffect(() => {
    const subscription = state$.subscribe(([value]) => {
      onChange && onChange(value);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    });
    return () => subscription.unsubscribe();
  }, [state$, onChange]);

  return (
    <div
      className={`${classes['cover']} ${!!value ? classes['uploaded'] : ''}`}
      onClick={() => fileInputRef.current?.click()}
    >
      {value && (
        <Image
          src={typeof value === 'string' ? value : value.url}
          alt="book cover"
          layout="fill"
          unoptimized
        />
      )}
      <input
        type="file"
        accept="images/*"
        ref={fileInputRef}
        onChange={(event: UploadEvent) => upload.next(event)}
        hidden
      />
    </div>
  );
}
