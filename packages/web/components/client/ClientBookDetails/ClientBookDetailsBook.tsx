import React from 'react';
import { H3 } from '@blueprintjs/core';
import { BookModel } from '@/components/BookModel';
import { Tags } from '@/components/Tags';
import { BookStatus, Schema$Book } from '@/typings';
import classes from './ClientBookDetails.module.scss';

interface Props {
  book: Partial<Schema$Book>;
}

export function ClientBookDetailsBook({ book }: Props) {
  return (
    <div className={classes.header}>
      <BookModel
        flatten
        width={80}
        className={classes['book-model']}
        cover={book.cover}
      />

      <div className={classes['header-content']}>
        <div className={classes['header-title']}>
          <H3>{book.name}</H3>
          <span>{book.author?.nickname} 著</span>
        </div>
        {book.status && (
          <Tags
            tags={[
              book.status === BookStatus.Finished ? '已完結' : '連載中',
              ...(book.tags || [])
            ]}
          />
        )}
        <div className={classes.description}>{book.description}</div>
      </div>
    </div>
  );
}
