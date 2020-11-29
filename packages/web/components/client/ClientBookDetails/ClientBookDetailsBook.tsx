import React from 'react';
import { H3 } from '@blueprintjs/core';
import { BookModel } from '@/components/BookModel';
import { Tags } from '@/components/Tags';
import { Schema$Book } from '@/typings';
import classes from './ClientBookDetails.module.scss';

interface Props {
  book: Partial<Schema$Book>;
}

export function ClientBookDetailsBook({ book }: Props) {
  return (
    <div className={classes.header}>
      <BookModel
        className={classes['book-model']}
        width={80}
        cover={book.cover}
      />

      <div className={classes['header-content']}>
        <div className={classes['header-title']}>
          <H3>{book.name}</H3>
          <span>{book.author?.nickname} 著</span>
        </div>
        <Tags tags={book.tags || []} />
        <div className={classes.description}>{book.description}</div>
      </div>
    </div>
  );
}
