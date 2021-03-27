import { DOMPurify as Handler } from '@/utils/dom-purify';
import { Transform } from 'class-transformer';

export function DOMPurify() {
  return Transform(({ value }): string =>
    typeof value === 'string' ? Handler.sanitize(value) : value
  );
}
