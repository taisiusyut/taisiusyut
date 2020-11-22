import { Expose, ExposeOptions } from 'class-transformer';
import { UserRole, Permissions } from '@/typings';

type Key = keyof typeof UserRole | Permissions;

export const Group = (
  groups: Key[],
  options?: ExposeOptions
): ReturnType<typeof Expose> => Expose({ groups, ...options });

export const groups = (...args: Key[]) => args;

export const AuthorOnly = (options?: ExposeOptions) =>
  Expose({ ...options, groups: [UserRole[UserRole.Author]] });

export const ClientOnly = (options?: ExposeOptions) =>
  Expose({ ...options, groups: [UserRole[UserRole.Client]] });
