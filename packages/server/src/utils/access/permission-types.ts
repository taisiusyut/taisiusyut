type CRUD<T extends string> =
  | `${T}_create`
  | `${T}_update`
  | `${T}_delete`
  | `${T}_get_all`
  | `${T}_get`;

export type UserPermission =
  | CRUD<'user'>
  | 'delete-account'
  | 'modify-password'
  | 'author_word_count'
  | 'update_book_collection';

export type BookPermission =
  | CRUD<'book'>
  | 'book_publish_finish'
  | 'book_status_update'
  | 'book_word_count';

export type ChapterPermission =
  | CRUD<'chapter'>
  | 'chapter_publish'
  | 'chapter_private'
  | 'chapter_status_update';

export type PaymentPermission = CRUD<'payment'> | 'payment_get_by_user';

export type CloudinaryPermission = 'cloudinary_sign';

export type AnnouncementPermission = CRUD<'announcement'>;

export type Permission =
  | AnnouncementPermission
  | UserPermission
  | BookPermission
  | ChapterPermission
  | PaymentPermission
  | CloudinaryPermission;
