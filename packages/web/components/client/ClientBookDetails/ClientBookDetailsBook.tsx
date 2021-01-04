import React from 'react';
import router from 'next/router';
import { Card } from '@blueprintjs/core';
import { BookModel } from '@/components/BookModel';
import { Skelecton } from '@/components/Skelecton';
import { getBookStatusTagProps, Tags } from '@/components/Tags';
import { Schema$Book } from '@/typings';
import classes from './ClientBookDetails.module.scss';

interface Props {
  book: Partial<Schema$Book>;
}

export function ClientBookDetailsBook({ book }: Props) {
  return (
    <Card className={classes['book']}>
      <BookModel
        flatten
        width={80}
        className={classes['book-model']}
        cover={book.cover}
      />

      <div className={classes['book-content']}>
        <div className={classes['book-title']}>
          <span className={classes['name']}>
            <Skelecton length={3}>{book.name}</Skelecton>
          </span>
          <span className={classes['author']}>
            <Skelecton length={2}>
              {book.authorName && `${book.authorName} 著`}
            </Skelecton>
          </span>
        </div>
      </div>

      <div className={classes['tags']}>
        {book.status && (
          <Tags
            tags={[
              {
                ...getBookStatusTagProps(book.status),
                interactive: false
              },
              ...(book.tags || [])
            ]}
            onTagClick={tag =>
              router.push(
                { pathname: '/search', query: { tag: tag.children as string } },
                undefined,
                { shallow: true }
              )
            }
          />
        )}
      </div>

      <div className={classes['description']}>
        <Skelecton length={60}>{book.description}</Skelecton>
      </div>
    </Card>
  );
}
