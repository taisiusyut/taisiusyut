import React from 'react';
import { BookModel } from '@/components/BookModel';
import { Tags } from '@/components/Tags';
import { BookStatus, Schema$Book } from '@/typings';
import classes from './ClientBookDetails.module.scss';

interface Props {
  book: Partial<Schema$Book>;
}

export function ClientBookDetailsBook({ book }: Props) {
  return (
    <div className={classes['book']}>
      <BookModel
        flatten
        width={80}
        className={classes['book-model']}
        cover={book.cover}
      />

      <div className={classes['book-content']}>
        <div className={classes['book-title']}>
          <span className={classes['name']}>{book.name}</span>
          <span className={classes['author']}>{book.author?.nickname} 著</span>
        </div>
      </div>

      <div className={classes['tags']}>
        {book.status && (
          <Tags
            tags={[
              book.status === BookStatus.Finished ? '已完結' : '連載中',
              ...(book.tags || [])
            ]}
          />
        )}
      </div>

      <div className={classes.description}>{book.description}</div>
    </div>
  );
}
