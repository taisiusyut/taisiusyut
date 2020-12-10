import React, { useState } from 'react';
import { useRxAsync } from 'use-rx-hooks';
import { Card, Divider, H4 } from '@blueprintjs/core';
import { ClientHeader } from '@/components/client/ClientHeader';
import { GoBackButton } from '@/components/GoBackButton';
import { Pagination } from '@/components/Pagination';
import { BookShelfToggle } from '@/components/client/BookShelf/BookShelfToggle';
import { createUsePaginationLocal } from '@/hooks/usePaginationLocal';
import {
  createCRUDReducer,
  DefaultCRUDActionTypes
} from '@/hooks/crud-reducer';
import {
  Order,
  PaginateResult,
  Schema$Book,
  Schema$Chapter,
  Param$GetChapters
} from '@/typings';
import { getBookByName, getChapters } from '@/service';
import { ClientBookDetailsBook } from './ClientBookDetailsBook';
import { ClientBookDetailsChapters } from './ClientBookDetailsChapters';
import classes from './ClientBookDetails.module.scss';

export interface ClientBookDetailsData {
  bookName: string;
  book: Schema$Book | null;
  chapters?: PaginateResult<Schema$Chapter>;
}

export interface ClientBookDetailsProps extends ClientBookDetailsData {}

export interface ChaptersProps {
  bookID: string;
  bookName: string;
  chapters?: PaginateResult<Schema$Chapter>;
}

function useBook(
  bookName: string,
  initialData?: Schema$Book | null
): Schema$Book | null {
  const [request] = useState(() => () => getBookByName({ bookName }));
  const [{ data }] = useRxAsync(request, { defer: !!initialData });
  return initialData || data || null;
}

function Chapters({ bookID, bookName, chapters }: ChaptersProps) {
  const [useChapters] = useState(() => {
    const [, reducer] = createCRUDReducer<Schema$Chapter, 'id'>('id');
    return createUsePaginationLocal(
      'id',
      (params?: Param$GetChapters) =>
        getChapters({
          ...params,
          bookID,
          sort: { createdAt: Order.ASC }
        }),
      {
        defaultState: { pageSize: chapters?.pageSize },
        initializer: state => ({
          ...reducer(state, {
            type: DefaultCRUDActionTypes.PAGINATE,
            payload: chapters
          })
        })
      }
    );
  });
  const { data, pagination } = useChapters();

  return (
    <Card className={classes['chapters-card']}>
      <H4>&nbsp;&nbsp;章節目錄</H4>
      <ClientBookDetailsChapters bookName={bookName} chapters={data} />
      <div className={classes['chapters-footer']}></div>
      <Divider className={classes.divider} />
      <Pagination {...pagination} />
    </Card>
  );
}

export function ClientBookDetails({
  bookName,
  book: defaultBook,
  chapters
}: ClientBookDetailsProps) {
  const book = useBook(bookName, defaultBook);

  return (
    <>
      <ClientHeader
        left={<GoBackButton targetPath="/" />}
        right={<>{book && <BookShelfToggle bookID={book.id} />}</>}
      />
      <div className={classes['content']}>
        <Card>{book && <ClientBookDetailsBook book={book} />}</Card>
        {book && (
          <Chapters bookID={book.id} bookName={book.name} chapters={chapters} />
        )}
      </div>
    </>
  );
}
