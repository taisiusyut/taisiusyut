import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { BookModel } from '@/components/BookModel';
import { BookStatusTag } from '@/components/Tags';
import { Skelecton } from '@/components/Skelecton';
import { Schema$Book } from '@/typings';
import classes from './ClientSearchItem.module.scss';
import dayjs from 'dayjs';

export type Book = Partial<Schema$Book> & { id: string };

interface Props {
  book: Partial<Book>;
}

export function ClientSearchItem({ book }: Props) {
  const { asPath } = useRouter();

  const className = classes['item'];

  const content = (flatten: boolean) => (
    <div className={classes['item-body']}>
      <BookModel
        width={55}
        flatten={flatten}
        className={classes['book-model']}
      />
      <div className={classes['item-content']}>
        <div className={classes['book-name']}>
          <Skelecton length={3}>{book?.name}</Skelecton>
        </div>
        <div className={classes['book-author']}>
          <Skelecton length={3}>
            {book?.authorName && `${book.authorName} 著`}
          </Skelecton>
        </div>

        <div className={classes['book-updated-at']}>
          <Skelecton length={4}>
            {book.updatedAt &&
              `上次更新: ${dayjs(book.updatedAt).format('YYYY-MM-DD')}`}
          </Skelecton>
        </div>
      </div>
      <div className={classes['book-status']}>
        <Skelecton length={1}>
          {book.status && <BookStatusTag status={book.status} />}
        </Skelecton>
      </div>
    </div>
  );

  if (book && book.name) {
    const basePath = `/book/${book.name}`;
    const active = decodeURIComponent(asPath).startsWith(basePath);
    const handleClick = () =>
      window.dataLayer.push({
        event: 'view_book',
        content_type: 'search',
        item_id: book.name
      });
    return (
      <div
        onClick={handleClick}
        className={[className, active ? classes['active'] : '']
          .join(' ')
          .trim()}
      >
        <Link href={basePath} prefetch={false}>
          {content(active)}
        </Link>
      </div>
    );
  }

  return <div className={className}>{content(false)}</div>;
}
