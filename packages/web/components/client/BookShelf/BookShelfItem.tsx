import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { BookModel } from '@/components/BookModel';
import { BookShelf, useBookShelf } from '@/hooks/useBookShelf';
import { useContextMenu } from '@/hooks/useContextMenu';
import { openBookShelfItemActions, Offset } from './BookShelfItemActions';
import classes from './BookShelf.module.scss';

interface Props {
  data: BookShelf;
}

function getOffset<T>(
  event: React.MouseEvent<T> | React.TouchEvent<T>
): Offset | undefined {
  if (event instanceof TouchEvent) {
    return {
      top: event.touches[0].clientY,
      left: event.touches[0].clientX
    };
  } else if (event instanceof MouseEvent) {
    return { top: event.clientY, left: event.clientX };
  }
}

export function BookShelfItem({
  data: { book, latestChapter, lastVisit }
}: Props) {
  const { asPath } = useRouter();

  const className = [classes['book-shelf-item']];

  const [shelf, actions] = useBookShelf();

  const [ref] = useContextMenu<HTMLDivElement>(event => {
    return (
      book &&
      openBookShelfItemActions({
        bookID: book.id,
        shelf,
        actions,
        offset: getOffset(event)
      })
    );
  });

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
      <>
        <Link href={`${basePath}/chapter/${lastVisit || 1}`}>
          {/* Should not use <a /> since it have conflict with context menu in In iPhone safari */}
          <div
            ref={ref}
            className={[...className, active ? classes.active : '']
              .join(' ')
              .trim()}
          >
            {content(active)}
          </div>
        </Link>
      </>
    );
  }

  return (
    <div className={[...className, classes.skeleton].join(' ').trim()}>
      {content(false)}
    </div>
  );
}
