import React, { useState } from 'react';
import { Card, ICardProps } from '@blueprintjs/core';
import { BookModel } from '@/components/BookModel';
import { Skelecton } from '@/components/Skelecton';
import { TagsProps } from '@/components/Tags';
import { AuthorLink } from '@/components/client/AuthorLink';
import { BookTags } from './BookTags';
import { Schema$Book } from '@/typings';
import defaultClasses from './BookInfoCard.module.scss';

interface Props extends ICardProps, Pick<TagsProps, 'onTagClick'> {
  author?: boolean;
  book: Partial<Schema$Book>;
  bookModelSize?: number;
  classes?: typeof defaultClasses;
  flatten?: boolean;
}

export function BookInfoCard({
  classes: _classes,
  className = '',
  children,
  flatten = true,
  author = true,
  bookModelSize = 80,
  book,
  onTagClick,
  ...props
}: Props) {
  const [classes] = useState(() => ({ ...defaultClasses, ..._classes }));
  const { authorName } = book;

  return (
    <Card {...props} className={`${classes['book']} ${className}`.trim()}>
      <div className={classes['book-model-container']}>
        <BookModel
          width={bookModelSize}
          flatten={flatten}
          cover={book.cover}
          className={classes['book-model']}
        />
      </div>

      <div className={classes['content']}>
        <div className={classes['header']}>
          <span className={classes['name']}>
            <Skelecton length={3}>{book.name}</Skelecton>
          </span>
          {author && (
            <span className={classes['author']}>
              <Skelecton length={2}>
                {authorName && (
                  <AuthorLink authorName={authorName}>
                    {authorName} 著
                  </AuthorLink>
                )}
              </Skelecton>
            </span>
          )}
        </div>

        <BookTags book={book} onTagClick={onTagClick} />

        <div className={classes['description']}>
          <Skelecton length={60}>{book.description}</Skelecton>
        </div>

        <div className={classes['footer']}>
          <div>{book.numOfCollection} 收藏</div>
          <div>|</div>
          <div>{book.wordCount} 字</div>
        </div>
      </div>

      {children}
    </Card>
  );
}
