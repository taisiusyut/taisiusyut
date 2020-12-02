import React, { useState } from 'react';
import { useRxAsync } from 'use-rx-hooks';
import { Card, Divider } from '@blueprintjs/core';
import { ClientHeader } from '@/components/client/ClientHeader';
import { HistoryBackButton } from '@/components/HistoryBackButton';
import { Pagination } from '@/components/Pagination';
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
import { getBook, getChapters } from '@/service';
import { ClientBookDetailsBook } from './ClientBookDetailsBook';
import { ClientBookDetailsChapters } from './ClientBookDetailsChapters';
import classes from './ClientBookDetails.module.scss';

export interface ClientBookDetailsData {
  bookID: string;
  book: Schema$Book | null;
  chapters?: PaginateResult<Schema$Chapter>;
}

export interface ClientBookDetailsProps extends ClientBookDetailsData {}

function useBook(
  bookID: string,
  initialData?: Schema$Book | null
): Partial<Schema$Book> {
  const [request] = useState(() => () => getBook({ id: bookID }));
  const [{ data }] = useRxAsync(request, { defer: !!initialData });
  return initialData || data || {};
}

export function ClientBookDetails(props: ClientBookDetailsProps) {
  const book = useBook(props.bookID, props.book);
  const [useChapters] = useState(() => {
    const [, reducer] = createCRUDReducer<Schema$Chapter, 'id'>('id');
    return createUsePaginationLocal(
      'id',
      (params?: Param$GetChapters) =>
        getChapters({
          ...params,
          bookID: props.bookID,
          sort: { createdAt: Order.ASC }
        }),
      {
        defaultState: { pageSize: props.chapters?.pageSize },
        initializer: state => ({
          ...reducer(state, {
            type: DefaultCRUDActionTypes.PAGINATE,
            payload: props.chapters
          })
        })
      }
    );
  });
  const { data, pagination } = useChapters();

  return (
    <div>
      <ClientHeader left={<HistoryBackButton fallbackURL="/" />} />
      <div className={classes['content']}>
        <Card elevation={1}>
          <ClientBookDetailsBook book={book} />
        </Card>

        <Card elevation={1} className={classes['chapters-card']}>
          <ClientBookDetailsChapters chapters={data} />
          <Divider className={classes.divider} />
          <Pagination {...pagination} />
        </Card>
      </div>
    </div>
  );
}
