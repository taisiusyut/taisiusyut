import React, { ReactNode } from 'react';
import router from 'next/router';
import { Button, Card } from '@blueprintjs/core';
import { PageHeader } from '@/components/admin/PageHeader';
import { Schema$Chapter, UserRole } from '@/typings';
import classes from './BookDetails.module.scss';

interface Props {
  bookID: string;
  chapters: Schema$Chapter[];
  role?: UserRole;
  filter?: ReactNode;
}

// TODO: chapter line-height

const gotooChapter = (bookID: string, chapterID?: string) => () => {
  let pathname = `/admin/book/${bookID}/chapters`;
  if (chapterID) {
    pathname += `/${chapterID}`;
  }
  return router.push(pathname);
};

export function BookDetailsChapters({ bookID, chapters, role, filter }: Props) {
  const isAuthor = role === UserRole.Author;

  return (
    <Card className={classes.chapters}>
      <PageHeader title="Chapters">
        {isAuthor && (
          <Button minimal icon="plus" onClick={gotooChapter(bookID)} />
        )}
      </PageHeader>

      {filter}

      <div className={classes['chapters-content']}>
        {chapters.map(chapter => (
          <Button
            fill
            minimal
            alignText="left"
            key={chapter.id}
            onClick={isAuthor ? gotooChapter(bookID, chapter.id) : undefined}
          >
            {chapter.name}
          </Button>
        ))}
      </div>
    </Card>
  );
}
