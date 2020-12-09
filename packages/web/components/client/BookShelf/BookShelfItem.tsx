import React from 'react';
import { BookShelf } from '@/hooks/useBookShelf';
import { BookModel } from '@/components/BookModel';
import classes from './BookShelf.module.scss';

interface Props {
  data: BookShelf;
}

export function BookShelfItem({ data: { book, latestChapter } }: Props) {
  return (
    <div className={classes['book-shelf-item']}>
      <BookModel width={55} className={classes['book-model']} />
      <div className={classes['book-shelf-item-content']}>
        <div className={classes['book-name']}>{book?.name}</div>
        <div className={classes['book-author']}>
          {book?.author && `${book.author} 著`}
        </div>
        <div className={classes['book-latest-chapter']}>
          {latestChapter && `連載至 ${latestChapter.name}`}
        </div>
      </div>
    </div>
  );
}
