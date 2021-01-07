import React from 'react';
import router from 'next/router';
import { ClientHeader, HeaderProps } from '@/components/client/ClientLayout';
import { BookInfoCard } from '@/components/BookInfoCard';
import { GoBackButton } from '@/components/GoBackButton';
import { withDesktopHeaderBtn } from '@/components/BlankButton';
import { BookShelfToggle } from '@/components/client/BookShelf/BookShelfToggle';
import {
  ClientBookError,
  useGetBookByName
} from '@/components/client/ClientBookError';
import { PaginateResult, Schema$Book, Schema$Chapter } from '@/typings';
import { ClientBookChaptersGrid, ChaptersGrid } from './ClientBookChaptersGrid';
import {
  ClientBookChaptersDrawer,
  ClientBookChaptersDrawerTrigger
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

const DesktopBookShelfToggle = withDesktopHeaderBtn(BookShelfToggle);

const headerProps: HeaderProps = {
  title: '書籍詳情',
  left: <GoBackButton targetPath={['/', '/featured', '/search']} />
};

const chapterPlaceHolders = Array.from({ length: 30 }).map((_, idx) => ({
  id: String(idx)
}));

const onTagClick = (tag: unknown) => {
  if (typeof tag === 'string') {
    router.push({ pathname: '/search', query: { tag } }, undefined, {
      shallow: true
    });
  }
};

export function ClientBookDetailsComponent({
  bookName,
  book: initialBook,
  chapters: initialChapters
}: ClientBookDetailsProps) {
  const bookState = useGetBookByName(bookName, !!initialBook);
  const book = bookState.data || initialBook;

  // book not found / error
  if (!book) {
    return (
      <>
        <ClientHeader {...headerProps} />
        <ClientBookError bookName={bookName} {...bookState} />
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
          onTagClick={tag => onTagClick(tag.children)}
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
          <ClientBookChaptersDrawerTrigger />
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
