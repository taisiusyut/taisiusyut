import { Exclude, Expose } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { Schema$Author, Schema$BookAuthor } from '@/typings';
import { groups } from '@/utils/access';

const Private = () => Expose({ groups: groups('Root', 'Admin') });

class Excluded implements Partial<Schema$BookAuthor> {
  @Exclude()
  password: undefined;

  @Exclude()
  status: undefined;

  @Exclude()
  role: undefined;

  @Exclude()
  wordCount: undefined;

  @Exclude()
  createdAt: undefined;

  @Exclude()
  updatedAt: undefined;
}

class BookAuthorOptional
  extends Excluded
  implements Partial<Omit<Schema$BookAuthor, keyof Excluded>> {
  @Private()
  id?: string;

  @Private()
  username?: string;

  @Private()
  email?: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class BookAuthor
  extends BookAuthorOptional
  implements Required<Omit<Schema$Author, keyof BookAuthorOptional>> {
  nickname: string;
}
