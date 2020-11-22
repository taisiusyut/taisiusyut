import { UserRole, Permissions } from '@/typings';

export const permissonsMap: Record<UserRole, Permissions[]> = {
  [UserRole.Root]: [
    'user_create',
    'user_update',
    'user_delete',
    'user_get_all',
    'user_get',

    'book_update',
    'book_delete',
    'book_get_all',
    'book_get',
    'book_status_get',
    'book_status_update',

    'chapter_update',
    'chapter_delete',
    'chapter_get_all',
    'chapter_get',
    'chapter_status_get',
    'chapter_status_update',

    'payment_update',
    'payment_get_by_user'
  ],
  [UserRole.Admin]: [
    'user_create',
    'user_update',
    'user_delete',
    'user_get_all',
    'user_get',

    'book_update',
    'book_delete',
    'book_get_all',
    'book_get',
    'book_status_get',
    'book_status_update',

    'chapter_update',
    'chapter_delete',
    'chapter_get_all',
    'chapter_get',
    'chapter_status_get',
    'chapter_status_update',

    'payment_update',
    'payment_get_by_user'
  ],
  [UserRole.Author]: [
    'user_get',

    'book_create',
    'book_update',
    'book_get_all',
    'book_get',
    'book_status_get',
    'book_public',
    'book_finish',

    'chapter_create',
    'chapter_update',
    'chapter_get_all',
    'chapter_get',
    'chapter_status_get',

    'payment_create',

    'cloudinary_sign'
  ],
  [UserRole.Client]: [
    //
    'payment_create'
  ]
};

export const allPermissions = Object.values(permissonsMap).reduce(
  (result, permissions) =>
    permissions.reduce(
      (result, p) => (result.includes(p) ? result : [...result, p]),
      result
    ),
  [] as Permissions[]
);
