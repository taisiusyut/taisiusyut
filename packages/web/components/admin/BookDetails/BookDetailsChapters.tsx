import React from 'react';
import router from 'next/router';
import { Button, Card, Classes, H4 } from '@blueprintjs/core';
import { Schema$Chapter } from '@/typings';
import classes from './BookDetails.module.scss';

interface Props {
  bookID: string;
  chapters: Schema$Chapter[];
}

const gotooChapter = (bookID: string, chapterID?: string) => () => {
  let pathname = `/admin/book/${bookID}/chapters`;
  if (chapterID) {
    pathname += `/${chapterID}`;
  }
  return router.push(pathname);
};

export function BookDetailsChapters({ bookID, chapters }: Props) {
  return (
    <Card className={classes.chapters}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <H4 style={{ marginBottom: 0, marginLeft: 10 }}>Chapters</H4>
        <Button minimal icon="plus" onClick={gotooChapter(bookID)} />
      </div>
      <div className={`${Classes.MENU} ${classes['chapters-content']}`}>
        {chapters.map(chapter => (
          <Button
            fill
            minimal
            alignText="left"
            key={chapter.id}
            onClick={gotooChapter(bookID, chapter.id)}
          >
            {chapter.name}
          </Button>
        ))}
      </div>
    </Card>
  );
}
