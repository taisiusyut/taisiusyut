import React, { useCallback } from 'react';
import { useRxAsync } from 'use-rx-hooks';
import { ClientHeader, HeaderProps } from '@/components/client/ClientLayout';
import { GoBackButton } from '@/components/GoBackButton';
import { withDesktopHeaderBtn } from '@/components/BlankButton';
import { BookShelfToggle } from '@/components/client/BookShelf/BookShelfToggle';
import { Toaster } from '@/utils/toaster';
import { PaginateResult, Schema$Book, Schema$Chapter } from '@/typings';
import { getBookByName } from '@/service';
import { ClientBookDetailsBook } from './ClientBookDetailsBook';
import { ClientBookChaptersGrid, ChaptersGrid } from './ClientBookChaptersGrid';
import { ClientBookChapters, BookChaptersContent } from './ClientBookChapters';
import classes from './ClientBookDetails.module.scss';

export interface ClientBookDetailsData {
  bookName: string;
  book: Schema$Book | null;
  chapters?: PaginateResult<Schema$Chapter>;
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

function useBook(
  bookName: string,
  initialData?: Schema$Book | null
): Schema$Book | null {
  const request = useCallback(() => getBookByName({ bookName }), [bookName]);
  const [{ data }] = useRxAsync(request, {
    defer: !!initialData,
    onFailure
  });
  return initialData || data || null;
}

export function ClientBookDetailsComponent({
  bookName,
  book: initialBook,
  chapters: initialChapters
}: ClientBookDetailsProps) {
  const book = useBook(bookName, initialBook);

  if (book) {
    return (
      <>
        <ClientHeader
          {...headerProps}
          right={[
            <DesktopBookShelfToggle key="0" icon minimal bookID={book.id} />
          ]}
        />
        <div className={classes['content']}>
          <ClientBookDetailsBook book={book} />
          <ClientBookChaptersGrid
            bookID={book.id}
            bookName={book.name}
            chapters={initialChapters}
          />
          <ClientBookChapters book={book} />
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

export function ClientBookDetails({
  bookName,
  book,
  ...props
}: Partial<ClientBookDetailsProps>) {
  if (bookName) {
    return (
      <ClientBookDetailsComponent
        {...props}
        book={book || null}
        bookName={bookName}
      />
    );
  }

  return (
    <>
      <ClientHeader {...headerProps} />
      <div className={classes['content']}>
        <ClientBookDetailsBook book={{}} />
        <ChaptersGrid chapters={chapterPlaceHolders} />
        <BookChaptersContent />
      </div>
    </>
  );
}
