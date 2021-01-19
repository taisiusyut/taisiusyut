import { UserRole } from '@/typings';
import { Permission } from './permission-types';

const admin: Permission[] = [
  'user_create',
  'user_update',
  'user_get_all',
  'user_get',
  'author_word_count',
  'update_book_collection',

  'book_update',
  'book_get_all',
  'book_get',
  'book_status_update',
  'book_word_count',

  'chapter_update',
  'chapter_delete',
  'chapter_get_all',
  'chapter_get',
  'chapter_status_update',

  'payment_update',
  'payment_get_by_user',

  'delete-account',
  'modify-password',

  'announcement_create',
  'announcement_update',
  'announcement_delete',
  'announcement_get_all',
  'announcement_get'
];

export const permissonsMap: Record<UserRole, Permission[]> = {
  [UserRole.Root]: [...admin, 'user_delete', 'book_delete'],
  [UserRole.Admin]: admin,
  [UserRole.Author]: [
    'author_word_count',
    'update_book_collection',

    'book_create',
    'book_update',
    'book_get_all',
    'book_get',
    'book_public_finish',
    'book_word_count',

    'chapter_create',
    'chapter_update',
    'chapter_get_all',
    'chapter_get',
    'chapter_public',
    'chapter_private',

    'payment_create',

    'cloudinary_sign',

    'modify-password',

    'announcement_get_all'
  ],
  [UserRole.Client]: ['payment_create', 'modify-password'],
  [UserRole.Guest]: [
    'user_get_all',
    'book_get_all',

    'chapter_get_all',

    'payment_get_all',

    'announcement_get_all',
    'announcement_get'
  ]
};

export const allPermissions = Object.values(permissonsMap).reduce(
  (result, permissions) =>
    permissions.reduce(
      (result, p) => (result.includes(p) ? result : [...result, p]),
      result
    ),
  [] as Permission[]
);
