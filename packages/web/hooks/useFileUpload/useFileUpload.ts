import { useEffect, useMemo } from 'react';
import { Subject } from 'rxjs';
import { getFileFromEvent, UploadEvent } from './uploadFile';

let input: HTMLInputElement;
if (typeof document !== 'undefined') {
  input = document.createElement('input');
  input.style.display = 'none';
  input.type = 'file';
  document.body.appendChild(input);
}

export function useFileUpload() {
  const props = useMemo(() => {
    const subject = new Subject<File>();
    const upload = () => input.click();
    return [subject, upload] as const;
  }, []);

  const [subject] = props;

  useEffect(() => {
    const handleChange = (event: Event) => {
      subject.next(getFileFromEvent(event as UploadEvent));
      input.value = '';
    };
    input.addEventListener('change', handleChange);
    return () => input.removeEventListener('change', handleChange);
  }, [subject]);

  return props;
}
