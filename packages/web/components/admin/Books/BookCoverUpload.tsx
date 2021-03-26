import React, { useEffect } from 'react';
import Image from 'next/image';
import { switchMap } from 'rxjs/operators';
import { Control } from '@/utils/form';
import { useFileUpload, getBase64ImageURL } from '@/hooks/useFileUpload';
import classes from './Books.module.scss';

interface State {
  file: File;
  url: string;
}

export function BookCoverUpload(props: Control<State | string | null>) {
  const [fileUpload$, upload] = useFileUpload();
  const { value, onChange } = props;

  useEffect(() => {
    const subscription = fileUpload$
      .pipe(
        switchMap(async file => ({
          url: await getBase64ImageURL(file),
          file
        }))
      )
      .subscribe(onChange);
    return () => subscription.unsubscribe();
  }, [fileUpload$, onChange]);

  return (
    <div
      className={`${classes['cover']} ${!!value ? classes['uploaded'] : ''}`}
      onClick={upload}
    >
      {value && (
        <Image
          src={typeof value === 'string' ? value : value.url}
          alt="book cover"
          layout="fill"
          unoptimized
        />
      )}
    </div>
  );
}
