import React from 'react';
import router from 'next/router';
import { Button, Card, Icon } from '@blueprintjs/core';
import { BookShelfToggle } from '@/components/client/BookShelf/BookShelfToggle';
import { withChaptersListDrawer } from '@/components/client/ChapterListDrawer';
import { Schema$Book } from '@/typings';
import classes from './ClientBookChapters.module.scss';

export interface Props {
  book: Schema$Book;
}

const ChaptersListDrawerCard = withChaptersListDrawer(Card);

export function ClientBookChapters({ book }: Props) {
  return (
    <div className={classes['content']}>
      <ChaptersListDrawerCard
        interactive
        chapterNo={0}
        bookID={book.id}
        bookName={book.name}
        className={classes['trigger']}
      >
        <div className={classes['chapter-head']}>章節目錄</div>
        <Icon icon="chevron-right" />
      </ChaptersListDrawerCard>

      <div className={classes['button-group']}>
        <Button
          fill
          intent="primary"
          text="第一章"
          onClick={() => router.push(`/book/${book.name}/chapter/1`)}
        />
        <BookShelfToggle bookID={book.id} fill />
      </div>
    </div>
  );
}
