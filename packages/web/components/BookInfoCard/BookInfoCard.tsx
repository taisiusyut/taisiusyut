import React from 'react';
import { Card } from '@blueprintjs/core';
import { BookModel } from '@/components/BookModel';
import { Skelecton } from '@/components/Skelecton';
import { getBookStatusTagProps, Tags, TagsProps } from '@/components/Tags';
import { Schema$Book } from '@/typings';
import classes from './BookInfoCard.module.scss';

interface Props extends Pick<TagsProps, 'onTagClick'> {
  book: Partial<Schema$Book>;
  author?: boolean;
  className?: string;
}

export function BookInfoCard({
  className = '',
  author = true,
  book,
  onTagClick
}: Props) {
  return (
    <Card className={`${classes['book']} ${className}`.trim()}>
      <BookModel
        flatten
        width={80}
        className={classes['book-model']}
        cover={book.cover}
      />

      <div className={classes['header']}>
        <div className={classes['title']}>
          <span className={classes['name']}>
            <Skelecton length={3}>{book.name}</Skelecton>
          </span>
          {author && (
            <span className={classes['author']}>
              <Skelecton length={2}>
                {book.authorName && `${book.authorName} 著`}
              </Skelecton>
            </span>
          )}
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
            onTagClick={onTagClick}
          />
        )}
      </div>

      <div className={classes['description']}>
        <Skelecton length={60}>{book.description}</Skelecton>
      </div>
    </Card>
  );
}
