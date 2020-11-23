import { Exclude, Expose } from 'class-transformer';
import { Schema$Author, Schema$BookAuthor } from '@/typings';
import { groups } from '@/utils/access';

const Private = () => Expose({ groups: groups('Root', 'Admin') });

class Excluded implements Partial<Schema$BookAuthor> {
  @Exclude()
  password: undefined;

  @Exclude()
  role: undefined;

  @Exclude()
  createdAt: undefined;

  @Exclude()
  updatedAt: undefined;
}

class Optional
  extends Excluded
  implements Partial<Omit<Schema$BookAuthor, keyof Excluded>> {
  @Private()
  id?: string;

  @Private()
  username?: string;

  @Private()
  email?: string;

  description?: string;
}

export class Author
  extends Optional
  implements Required<Omit<Schema$Author, keyof Optional>> {
  nickname: string;
}
