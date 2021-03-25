import { DragEvent, ChangeEvent } from 'react';
import { fromDropImageEvent, fromChangeEvent } from 'use-rx-hooks';

export type UploadEvent = ChangeEvent | ClipboardEvent | DragEvent;

export function getFileListFromEvent(event: UploadEvent) {
  if (event.type === 'drop') {
    return fromDropImageEvent(event as DragEvent);
  }
  return fromChangeEvent(event as ChangeEvent<HTMLInputElement>);
}

function getFile(f: DataTransferItem | File | null) {
  return f && (f instanceof File ? f : f.getAsFile());
}

export function getFilesFromEvent(event: UploadEvent) {
  const [fileList] = getFileListFromEvent(event);
  if (!fileList) throw new Error(`fileList not found`);

  const files: File[] = [];
  for (let i = 0; i < fileList.length; i++) {
    const f = getFile(fileList[i]);
    f && files.push(f);
  }
  return files;
}

export function getFileFromEvent(event: UploadEvent): File {
  const [file] = getFilesFromEvent(event);
  if (!file) throw new Error(`file not found`);
  return file;
}
