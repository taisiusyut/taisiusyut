import { Exclude, Expose } from 'class-transformer';
import { Schema$Author, Schema$BookAuthor } from '@/typings';
import { groups } from '@/decorators';

const Private = () => Expose({ groups: groups('Root', 'Admin') });

class Excluded implements Partial<Schema$BookAuthor> {
  @Exclude()
  password: undefined;

  @Exclude()
  description: undefined;

  @Exclude()
  role: undefined;

  @Exclude()
  createdAt: undefined;

  @Exclude()
  updatedAt: undefined;
}

class PrivateProperty
  extends Excluded
  implements Partial<Omit<Schema$BookAuthor, keyof Excluded>> {
  @Private()
  id?: string;

  @Private()
  username?: string;

  @Private()
  email?: string;
}

export class Author
  extends PrivateProperty
  implements Required<Omit<Schema$Author, keyof PrivateProperty>> {
  nickname: string;
}
