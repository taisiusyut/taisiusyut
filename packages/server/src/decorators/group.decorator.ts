import { UserRole } from '@/typings';
import { Expose, ExposeOptions } from 'class-transformer';

export const Group = (
  groups: (keyof typeof UserRole)[],
  options?: ExposeOptions
): ReturnType<typeof Expose> => Expose({ groups, ...options });
