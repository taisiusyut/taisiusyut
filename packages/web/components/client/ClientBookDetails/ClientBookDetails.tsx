import React, { ComponentProps, ReactNode, useState } from 'react';
import router from 'next/router';
import { useRxAsync } from 'use-rx-hooks';
import { Button, Card, Icon } from '@blueprintjs/core';
import { ClientHeader } from '@/components/client/ClientLayout';
import { GoBackButton } from '@/components/GoBackButton';
import { BookShelfToggle } from '@/components/client/BookShelf/BookShelfToggle';
import { withChaptersListDrawer } from '@/components/client/ChapterListDrawer';
import { useBreakPoints } from '@/hooks/useBreakPoints';
import { Toaster } from '@/utils/toaster';
import { PaginateResult, Schema$Book, Schema$Chapter } from '@/typings';
import { getBookByName } from '@/service';
import { ClientBookDetailsBook } from './ClientBookDetailsBook';
import { ClientBookDetailsChapters } from './ClientBookDetailsChapters';
import classes from './ClientBookDetails.module.scss';

export interface ClientBookDetailsData {
  bookName: string;
  book: Schema$Book | null;
  chapters?: PaginateResult<Schema$Chapter>;
}

export interface ClientBookDetailsProps extends ClientBookDetailsData {}

const onFailure = Toaster.apiError.bind(Toaster, `Get book failure`);

function useBook(
  bookName: string,
  initialData?: Schema$Book | null
): Schema$Book | null {
  const [request] = useState(() => () => getBookByName({ bookName }));
  const [{ data }] = useRxAsync(request, {
    defer: !!initialData,
    onFailure
  });
  return initialData || data || null;
}

const ChaptersListDrawerCard = withChaptersListDrawer(Card);

export function ClientBookDetails({
  bookName,
  book: initialBook,
  chapters: initialChapters
}: ClientBookDetailsProps) {
  const book = useBook(bookName, initialBook);
  const [breakPoint, mounted] = useBreakPoints();
  const headerProps: ComponentProps<typeof ClientHeader> = {
    title: '書籍詳情',
    left: <GoBackButton targetPath={['/', '/explore']} />
  };

  if (book) {
    let chapters: ReactNode = null;

    if (mounted) {
      if (breakPoint > 640) {
        chapters = (
          <ClientBookDetailsChapters
            bookID={book.id}
            bookName={book.name}
            chapters={initialChapters}
          />
        );
      } else {
        chapters = (
          <div className={classes['chapters-content']}>
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
            <div className={classes['button-group']}>
              <Button
                fill
                intent="primary"
                text="第一章"
                onClick={() => router.push(`/book/${bookName}/chapter/1`)}
              />
              <BookShelfToggle bookID={book.id} fill />
            </div>
          </div>
        );
      }
    }

    return (
      <>
        <ClientHeader
          {...headerProps}
          right={[<BookShelfToggle key="0" bookID={book.id} icon minimal />]}
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
      {/* TODO: */}
      <div className={classes['content']}>Book not found</div>
    </>
  );
}
