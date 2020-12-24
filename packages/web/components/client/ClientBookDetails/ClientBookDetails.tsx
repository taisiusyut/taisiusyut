import React, { ComponentProps, useState } from 'react';
import { useRxAsync } from 'use-rx-hooks';
import { ClientHeader } from '@/components/client/ClientLayout';
import { GoBackButton } from '@/components/GoBackButton';
import { withDesktopHeaderBtn } from '@/components/BlankButton';
import { BookShelfToggle } from '@/components/client/BookShelf/BookShelfToggle';
import { Toaster } from '@/utils/toaster';
import { PaginateResult, Schema$Book, Schema$Chapter } from '@/typings';
import { getBookByName } from '@/service';
import { ClientBookDetailsBook } from './ClientBookDetailsBook';
import { ClientBookChaptersGrid } from './ClientBookChaptersGrid';
import { ClientBookChapters } from './ClientBookChapters';
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

const DesktopBookShelfToggle = withDesktopHeaderBtn(BookShelfToggle);

export function ClientBookDetails({
  bookName,
  book: initialBook,
  chapters: initialChapters
}: ClientBookDetailsProps) {
  const book = useBook(bookName, initialBook);
  const headerProps: ComponentProps<typeof ClientHeader> = {
    title: '書籍詳情',
    left: <GoBackButton targetPath={['/', '/featured', '/search']} />
  };

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
