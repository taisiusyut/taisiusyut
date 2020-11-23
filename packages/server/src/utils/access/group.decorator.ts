import { Expose, ExposeOptions } from 'class-transformer';
import { UserRole } from '@/typings';
import { Permission } from './permission-types';

type Key = keyof typeof UserRole | Permission;

export const Group = (
  groups: Key[],
  options?: ExposeOptions
): ReturnType<typeof Expose> => Expose({ groups, ...options });

export const groups = (...args: Key[]) => args;

export const AuthorOnly = (options?: ExposeOptions) =>
  Expose({ ...options, groups: [UserRole[UserRole.Author]] });

export const ClientOnly = (options?: ExposeOptions) =>
  Expose({ ...options, groups: [UserRole[UserRole.Client]] });
