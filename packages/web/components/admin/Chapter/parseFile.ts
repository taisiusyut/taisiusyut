import { UploadEvent, readFileAsArrayBuffer } from '@/utils/fileUpload';

export async function extractDocxRawText(event: UploadEvent) {
  const { default: mammoth } = await import('mammoth');
  const buffer = await readFileAsArrayBuffer(event);
  const result = await mammoth.extractRawText({ buffer });
  return result.value;
}
