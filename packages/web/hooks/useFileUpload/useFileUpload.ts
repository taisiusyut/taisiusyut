import { useEffect, useRef, useState } from 'react';
import { Subject } from 'rxjs';
import { getFileFromEvent, UploadEvent } from './uploadFile';

interface UseFileUploadOptions {
  accept?: string;
}

export function useFileUpload({ accept }: UseFileUploadOptions = {}) {
  const inputRef = useRef<HTMLInputElement>();

  const [props] = useState(() => {
    const subject = new Subject<File>();
    const upload = () => inputRef.current?.click();
    return [subject, upload] as const;
  });

  const [subject] = props;

  useEffect(() => {
    const input = document.createElement('input');
    input.style.display = 'none';
    input.type = 'file';

    if (accept) {
      input.accept = accept;
    }

    const handleChange = (event: Event) => {
      subject.next(getFileFromEvent(event as UploadEvent));
      input.value = '';
    };
    input.addEventListener('change', handleChange);
    inputRef.current = input;
    document.body.appendChild(input);
    return () => {
      input.removeEventListener('change', handleChange);
      document.body.removeChild(input);
    };
  }, [subject, accept]);

  return props;
}
