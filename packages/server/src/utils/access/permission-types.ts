type CRUD<T extends string> =
  | `${T}_create`
  | `${T}_update`
  | `${T}_delete`
  | `${T}_get_all`
  | `${T}_get`;

export type UserPermission =
  | CRUD<'user'>
  | 'delete-account'
  | 'modify-password';

export type BookPermission =
  | CRUD<'book'>
  | 'book_public'
  | 'book_finish'
  | 'book_status_get'
  | 'book_status_update';

export type ChapterPermission =
  | CRUD<'chapter'>
  | 'chapter_public'
  | 'chapter_private'
  | 'chapter_status_get'
  | 'chapter_status_update';

export type PaymentPermission = CRUD<'payment'> | 'payment_get_by_user';

export type CloudinaryPermission = 'cloudinary_sign';

export type Permission =
  | UserPermission
  | BookPermission
  | ChapterPermission
  | PaymentPermission
  | CloudinaryPermission;
