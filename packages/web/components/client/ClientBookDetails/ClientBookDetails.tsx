import React, { useCallback } from 'react';
import router from 'next/router';
import { useRxAsync } from 'use-rx-hooks';
import { ClientHeader, HeaderProps } from '@/components/client/ClientLayout';
import { BookInfoCard } from '@/components/BookInfoCard';
import { GoBackButton } from '@/components/GoBackButton';
import { withDesktopHeaderBtn } from '@/components/BlankButton';
import { BookShelfToggle } from '@/components/client/BookShelf/BookShelfToggle';
import { Toaster } from '@/utils/toaster';
import { PaginateResult, Schema$Book, Schema$Chapter } from '@/typings';
import { getBookByName } from '@/service';
// import { ClientBookDetailsBook } from './ClientBookDetailsBook';
import { ClientBookError } from './ClientBookError';
import { ClientBookChaptersGrid, ChaptersGrid } from './ClientBookChaptersGrid';
import {
  ClientBookChaptersDrawer,
  ClientBookChaptersDrawerCard
} from './ClientBookChaptersDrawer';
import classes from './ClientBookDetails.module.scss';

export type ClientBookDetailsParams = {
  bookName: string;
};

export interface ClientBookDetailsData extends ClientBookDetailsParams {
  book: Schema$Book | null;
  chapters: PaginateResult<Schema$Chapter> | null;
}

export interface ClientBookDetailsProps extends ClientBookDetailsData {}

const onFailure = Toaster.apiError.bind(Toaster, `Get book failure`);

const DesktopBookShelfToggle = withDesktopHeaderBtn(BookShelfToggle);

const headerProps: HeaderProps = {
  title: '書籍詳情',
  left: <GoBackButton targetPath={['/', '/featured', '/search']} />
};

const chapterPlaceHolders = Array.from({ length: 30 }).map((_, idx) => ({
  id: String(idx)
}));

export function ClientBookDetailsComponent({
  bookName,
  book: initialBook,
  chapters: initialChapters
}: ClientBookDetailsProps) {
  const request = useCallback(() => getBookByName({ bookName }), [bookName]);
  const [{ data, error, loading }, { fetch }] = useRxAsync(request, {
    defer: !!initialBook,
    onFailure
  });
  const book = data || initialBook || null;

  // book not found / error
  if (!book) {
    return (
      <>
        <ClientHeader {...headerProps} />
        <ClientBookError
          bookName={bookName}
          loading={loading}
          retry={fetch}
          error={error}
        />
      </>
    );
  }

  return (
    <>
      <ClientHeader
        {...headerProps}
        right={[
          <DesktopBookShelfToggle key="0" icon minimal bookID={book.id} />
        ]}
      />
      <div className={classes['content']}>
        <BookInfoCard
          book={book}
          onTagClick={tag =>
            router.push(
              { pathname: '/search', query: { tag: tag.children as string } },
              undefined,
              { shallow: true }
            )
          }
        />
        <ClientBookChaptersGrid
          key={book.id}
          bookID={book.id}
          bookName={book.name}
          chapters={initialChapters}
        />
        <ClientBookChaptersDrawer book={book} />
      </div>
    </>
  );
}

export function ClientBookDetails({
  bookName,
  book,
  chapters,
  ...props
}: ClientBookDetailsProps & Partial<ClientBookDetailsParams>) {
  // fallback
  if (!bookName) {
    return (
      <>
        <ClientHeader {...headerProps} />
        <div className={classes['content']}>
          <BookInfoCard book={{}} />
          <ChaptersGrid chapters={chapterPlaceHolders} />
          <ClientBookChaptersDrawerCard />
        </div>
      </>
    );
  }

  return (
    <ClientBookDetailsComponent
      {...props}
      book={book}
      bookName={bookName}
      chapters={chapters}
    />
  );
}
