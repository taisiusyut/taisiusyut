import React from 'react';
import Link from 'next/link';
import { Card, H5 } from '@blueprintjs/core';
import { BookModel } from '@/components/BookModel';
import { Schema$Book, Category } from '@/typings';
import { useBoolean } from '@/hooks/useBoolean';
import classes from './ClientHome.module.scss';

interface Props {
  title: string;
  books: Schema$Book[];
}

function SectionItem({ book }: { book: Schema$Book }) {
  const [flatten, onMouseEnter, onMouseLeave] = useBoolean();

  return (
    <Card
      interactive
      className={classes['section-card']}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div>
        <BookModel cover={book.cover} flatten={flatten} />
      </div>
      <div className={classes['book-info']}>
        <div>{book.name}</div>
        <div>{book.author.nickname} 著</div>
        <div>{Category[book.category]}</div>
      </div>
    </Card>
  );
}

export function ClientHomeSection({ title, books }: Props) {
  if (books.length === 0) {
    return null;
  }

  return (
    <div className={classes['section']}>
      <H5>{title}</H5>
      <div className={classes['section-content']}>
        {books.map(book => (
          <Link key={book.id} href={`/book/${book.name}`}>
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a>
              <SectionItem book={book} />
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
}
