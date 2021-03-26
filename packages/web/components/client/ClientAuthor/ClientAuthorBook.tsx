import React, { useCallback } from 'react';
import { useRxAsync } from 'use-rx-hooks';
import { BookInfoCard } from '@/components/BookInfoCard';
import { getBooks } from '@/service';
import { Order, Schema$Book } from '@/typings';
import classes from './ClientAuthor.module.scss';
import Link from 'next/link';

interface ClientAuthorBookProps {
  authorName: string;
  books: Schema$Book[] | null;
}

const placeholder = Array.from<void, Partial<Schema$Book>>(
  { length: 5 },
  (_, index) => ({ id: String(index) })
);

export function ClientAuthorBook({
  books: initialBooks,
  authorName
}: ClientAuthorBookProps) {
  const request = useCallback(
    () =>
      getBooks({
        authorName,
        pageSize: 999,
        sort: { updateAt: Order.DESC }
      }).then(response => response.data),
    [authorName]
  );
  const defer = !!initialBooks && !!initialBooks.length;
  const [{ data = placeholder }] = useRxAsync(request, { defer });
  const books = initialBooks || data;

  return (
    <>
      <div className={classes['head']}>全部作品</div>
      <div className={classes['books']}>
        {books.map(book => {
          const content = (
            <BookInfoCard
              key={book.id}
              book={book}
              author={false}
              flatten={false}
              bookModelSize={60}
              classes={{
                tags: classes['book-tags'],
                'book-model': classes['book-model'],
                description: classes['book-description']
              }}
              interactive
            />
          );

          if (!book.name) {
            return content;
          }

          return (
            <Link key={book.id} href={`/book/${book.name}`} prefetch={false}>
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a>{content}</a>
            </Link>
          );
        })}
      </div>
    </>
  );
}
