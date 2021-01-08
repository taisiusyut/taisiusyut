import React, { useCallback } from 'react';
import { useRxAsync } from 'use-rx-hooks';
import { BookInfoCard } from '@/components/BookInfoCard';
import { getBooks } from '@/service';
import { Order, Schema$Book } from '@/typings';
import classes from './ClientAuthor.module.scss';
import Link from 'next/link';

interface ClientAuthorBookProps {
  authorName: string;
}

const placeholder = Array.from({ length: 5 }).map<Partial<Schema$Book>>(
  (_, index) => ({
    id: String(index)
  })
);

export function ClientAuthorBook({ authorName }: ClientAuthorBookProps) {
  const request = useCallback(
    () =>
      getBooks({
        authorName,
        pageSize: 999,
        sort: { updateAt: Order.DESC }
      }).then(response => response.data),
    [authorName]
  );
  const [{ data = placeholder }] = useRxAsync(request, { defer: false });

  return (
    <div className={classes['books']}>
      <div className={classes['head']}>全部作品</div>
      <div className={classes['book-list']}>
        {data.map(book => {
          const content = (
            <BookInfoCard
              interactive
              key={book.id}
              book={book}
              author={false}
              flatten={false}
              bookModelSize={70}
              className={classes['book']}
              classes={{
                tags: classes['book-tags'],
                description: classes['book-description']
              }}
            />
          );

          if (!book.name) {
            return content;
          }

          return (
            <Link href={`/book/${book.name}`}>
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a>{content}</a>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
