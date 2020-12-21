import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Tag } from '@blueprintjs/core';
import { BookModel } from '@/components/BookModel';
import { getTagPropsByStatus } from '@/components/Tags';
import { BookStatus, Schema$Book } from '@/typings';
import classes from './ClientSearchItem.module.scss';
import dayjs from 'dayjs';

export type Book = Partial<Schema$Book> & { id: string };

interface Props {
  book: Partial<Book>;
}

export function ClientSearchItem({ book }: Props) {
  const { asPath } = useRouter();

  const className = [classes['item']];

  const content = (flatten: boolean) => (
    <div className={classes['item-body']}>
      <BookModel
        width={55}
        flatten={flatten}
        className={classes['book-model']}
      />
      <div className={classes['item-content']}>
        <div className={classes['book-name']}>{book?.name}</div>
        <div className={classes['book-author']}>
          {book?.author && `${book.author.nickname} 著`}
        </div>
        <div className={classes['book-updated-at']}>
          {book.updatedAt &&
            `上次更新: ${dayjs(book.updatedAt).format('YYYY-MM-DD')}`}
        </div>
      </div>
      <div>
        <Tag
          {...getTagPropsByStatus(book.status)}
          className={classes['book-status']}
        >
          {book.status
            ? book.status === BookStatus.Finished
              ? '已完結'
              : '連載中'
            : ''}
        </Tag>
      </div>
    </div>
  );

  if (book && book.name) {
    const basePath = `/book/${book.name}`;
    const active = decodeURIComponent(asPath).startsWith(basePath);
    return (
      <div
        className={[...className, active ? classes['active'] : '']
          .join(' ')
          .trim()}
      >
        <Link href={basePath}>{content(active)}</Link>
      </div>
    );
  }

  return (
    <div className={[...className, classes['skeleton']].join(' ').trim()}>
      {content(false)}
    </div>
  );
}
