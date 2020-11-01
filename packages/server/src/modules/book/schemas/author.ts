import { Exclude, Expose } from 'class-transformer';
import { Schema$Author } from '@/typings';
import { groups } from '@/decorators';

const Private = () => Expose({ groups: groups('Root', 'Admin') });

class Excluded {
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

class PrivateProperty extends Excluded {
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
