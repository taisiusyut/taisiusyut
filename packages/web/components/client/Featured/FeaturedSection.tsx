import React from 'react';
import Link from 'next/link';
import { Card, H5 } from '@blueprintjs/core';
import { BookModel } from '@/components/BookModel';
import { Skelecton } from '@/components/Skelecton';
import { Schema$Book } from '@/typings';
import { useBoolean } from '@/hooks/useBoolean';
import dayjs from 'dayjs';
import classes from './Featured.module.scss';

export type Book =
  | Schema$Book
  | (Partial<Schema$Book> & Pick<Schema$Book, 'id'>);

interface Props {
  title: string;
  books: Book[];
}

function SectionItem({ book }: { book: Book }) {
  const [flatten, onMouseEnter, onMouseLeave] = useBoolean();

  return (
    <Card
      interactive
      className={classes['section-card']}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <BookModel
        className={classes['book-model']}
        cover={book.cover}
        flatten={flatten}
      />
      <div className={classes['book-info']}>
        <div className={classes['book-name']}>
          <Skelecton length={5}>{book.name}</Skelecton>
        </div>
        <div className={classes['book-author']}>
          <Skelecton length={3}>
            {book?.authorName && `${book.authorName} 著`}
          </Skelecton>
        </div>
        <div className={classes['book-last-published-at']}>
          <Skelecton length={3}>
            {book.lastPublishedAt &&
              `上次更新: ${dayjs(book.lastPublishedAt).fromNow()}`}
          </Skelecton>
        </div>
      </div>
    </Card>
  );
}

export function FeaturedSection({ title, books }: Props) {
  if (books.length === 0) {
    return null;
  }

  return (
    <div className={classes['section']}>
      <H5>{title}</H5>
      <div className={classes['section-content']}>
        {books.map(book => {
          if (book.name) {
            const handleClick = () =>
              window.dataLayer.push({
                event: 'view_book',
                content_type: 'featured',
                item_id: book.name
              });

            return (
              <Link key={book.id} href={`/book/${book.name}`} prefetch={false}>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a onClick={handleClick}>
                  <SectionItem book={book} />
                </a>
              </Link>
            );
          }

          return <SectionItem key={book.id} book={book} />;
        })}
      </div>
    </div>
  );
}
