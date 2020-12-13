import React, { ComponentProps, ReactNode, useState } from 'react';
import { useRxAsync } from 'use-rx-hooks';
import { Card, Divider, Icon } from '@blueprintjs/core';
import { ClientHeader } from '@/components/client/ClientHeader';
import { GoBackButton } from '@/components/GoBackButton';
import { Pagination } from '@/components/Pagination';
import { ClientPreferences } from '@/components/client/ClientPreferences';
import { withChaptersListDrawer } from '@/components/client/ChapterListDrawer';
import { createUsePaginationLocal } from '@/hooks/usePaginationLocal';
import { useBreakPoints } from '@/hooks/useBreakPoints';
import {
  createCRUDReducer,
  DefaultCRUDActionTypes
} from '@/hooks/crud-reducer';
import { Toaster } from '@/utils/toaster';
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

const onGetBookFailure = Toaster.apiError.bind(Toaster, `Get book failure`);
const onGetChapterFailure = Toaster.apiError.bind(
  Toaster,
  `Get chapters failure`
);

function useBook(
  bookName: string,
  initialData?: Schema$Book | null
): Schema$Book | null {
  const [request] = useState(() => () => getBookByName({ bookName }));
  const [{ data }] = useRxAsync(request, {
    defer: !!initialData,
    onFailure: onGetBookFailure
  });
  return initialData || data || null;
}

function ChaptersGrid({ bookID, bookName, chapters }: ChaptersProps) {
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
  const { data, pagination } = useChapters({ onFailure: onGetChapterFailure });

  return (
    <Card className={classes['chapters-grid-card']}>
      <div className={classes['chapter-head']}>章節目錄</div>
      <ClientBookDetailsChapters bookName={bookName} chapters={data} />
      <div className={classes['spacer']} />
      <Divider className={classes['divider']} />
      <Pagination {...pagination} />
    </Card>
  );
}

const ChaptersListDrawerCard = withChaptersListDrawer(Card);

export function ClientBookDetails({
  bookName,
  book: initialBook,
  chapters: initialChapters
}: ClientBookDetailsProps) {
  const book = useBook(bookName, initialBook);
  const breakPoint = useBreakPoints();
  const headerProps: ComponentProps<typeof ClientHeader> = {
    title: '書籍詳情',
    left: <GoBackButton targetPath="/" />
  };

  if (book) {
    let chapters: ReactNode = null;

    if (breakPoint > 640) {
      chapters = (
        <ChaptersGrid
          bookID={book.id}
          bookName={book.name}
          chapters={initialChapters}
        />
      );
    } else {
      chapters = (
        <ChaptersListDrawerCard
          interactive
          chapterNo={0}
          bookID={book.id}
          bookName={book.name}
          className={classes['chapters-list-trigger']}
        >
          <div className={classes['chapter-head']}>章節目錄</div>
          <Icon icon="chevron-right" />
        </ChaptersListDrawerCard>
      );
    }

    return (
      <>
        <ClientHeader
          {...headerProps}
          right={[<ClientPreferences key="1" />]}
        />
        <div className={classes['content']}>
          <Card>
            <ClientBookDetailsBook book={book} />
          </Card>
          {chapters}
        </div>
      </>
    );
  }

  return (
    <>
      <ClientHeader {...headerProps} />
      <div className={classes['content']}>Book not found</div>
    </>
  );
}
