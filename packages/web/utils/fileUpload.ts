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
  for (const i in fileList) {
    const f = getFile(fileList[i]);
    f && files.push(f);
  }
  return files;
}

export function getFileFromEvent(event: UploadEvent): File | null {
  const [file] = getFilesFromEvent(event);
  return file;
}

export async function readFileAsArrayBuffer(event: UploadEvent) {
  return new Promise<ArrayBuffer>((resolve, reject) => {
    const [file] = getFilesFromEvent(event);

    if (file) {
      const reader = new FileReader();

      reader.onload = function (event) {
        const arrayBuffer = event.target?.result;
        if (arrayBuffer instanceof ArrayBuffer) {
          resolve(arrayBuffer);
        } else {
          reject(`expect "ArrayBuffer" but receive ${typeof arrayBuffer}`);
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    } else {
      reject(new Error(`file not found`));
    }
  });
}

export async function readFileAsText(event: UploadEvent) {
  return new Promise<string>((resolve, reject) => {
    const [file] = getFilesFromEvent(event);

    if (file) {
      const reader = new FileReader();

      reader.onload = function (event) {
        const text = event.target?.result;
        if (typeof text === 'string') {
          resolve(text);
        } else {
          reject(`expect "string" but receive ${typeof text}`);
        }
      };
      reader.onerror = reject;
      reader.readAsText(file);
    } else {
      reject(new Error(`file not found`));
    }
  });
}
