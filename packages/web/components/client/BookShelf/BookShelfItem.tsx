import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { BookModel } from '@/components/BookModel';
import { BookShelf } from '@/hooks/useBookShelf';
import classes from './BookShelf.module.scss';

interface Props {
  data: BookShelf;
}

export function BookShelfItem({
  data: { book, latestChapter, lastVisit }
}: Props) {
  const { asPath } = useRouter();
  const className = [classes['book-shelf-item']];
  const content = (flatten: boolean) => (
    <>
      <BookModel width={55} flatten={flatten} />
      <div className={classes['book-shelf-item-content']}>
        <div className={classes['book-name']}>{book?.name}</div>
        <div className={classes['book-author']}>
          {book?.author && `${book.author.nickname} 著`}
        </div>
        <div className={classes['book-latest-chapter']}>
          {latestChapter && `連載至 ${latestChapter.name}`}
        </div>
      </div>
    </>
  );

  if (book) {
    const basePath = `/book/${book.name}`;
    const active = decodeURIComponent(asPath).startsWith(basePath);

    return (
      <Link href={`${basePath}/chapter/${lastVisit || 1}`}>
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
        <a
          className={[...className, active ? classes.active : '']
            .join(' ')
            .trim()}
        >
          {content(active)}
        </a>
      </Link>
    );
  }

  return (
    <div className={[...className, classes.skeleton].join(' ').trim()}>
      {content(false)}
    </div>
  );
}
