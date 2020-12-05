import { Exclude } from 'class-transformer';
import { Param$GetBooksFromShelf, Schema$BookShelf } from '@/typings';
import { QueryDto } from '@/utils/mongoose';

class Excluded
  extends QueryDto
  implements Partial<Record<keyof Schema$BookShelf, unknown>> {
  @Exclude()
  id: undefined;

  @Exclude()
  user: undefined;

  @Exclude()
  book: undefined;

  @Exclude()
  pin: undefined;

  @Exclude()
  lastVisit: undefined;

  @Exclude()
  latestChapter: undefined;
}

class GetBooksFromShelf
  extends Excluded
  implements
    Partial<Omit<Param$GetBooksFromShelf, keyof Excluded>>,
    Partial<Omit<Record<keyof Schema$BookShelf, unknown>, keyof Excluded>> {}

export class GetBooksFromShelfDto
  extends GetBooksFromShelf
  implements
    Required<Omit<Schema$BookShelf, keyof GetBooksFromShelf>>,
    Required<Omit<Param$GetBooksFromShelf, keyof GetBooksFromShelf>> {}
