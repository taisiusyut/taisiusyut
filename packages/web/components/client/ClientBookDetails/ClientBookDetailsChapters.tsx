import React from 'react';
import router from 'next/router';
import { Schema$Chapter } from '@/typings';
import { Classes, Tag } from '@blueprintjs/core';
import classes from './ClientBookDetails.module.scss';

interface Props {
  bookName: string;
  chapters: Partial<Schema$Chapter>[];
}

// TODO: empty chapter

export function ClientBookDetailsChapters({ bookName, chapters }: Props) {
  const maxLength = String(chapters.slice(-1)[0]?.number || '').length;

  return (
    <div className={classes.chapters}>
      {chapters.map(chapter => {
        return (
          <div
            key={chapter.id}
            className={[Classes.MENU_ITEM, classes['chapter-item']].join(' ')}
            onClick={() =>
              router.push(`/book/${bookName}/chapter/${chapter.number}`)
            }
          >
            <Tag minimal className={classes.tag}>
              {chapter.number &&
                String(chapter.number).padStart(maxLength, '0')}
            </Tag>
            <span className={classes['chapter-name']}>{chapter.name}</span>
          </div>
        );
      })}
    </div>
  );
}
