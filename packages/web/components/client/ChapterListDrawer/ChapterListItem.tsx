import React from 'react';
import type { ListRowProps } from 'react-virtualized/dist/es/List';
import { Schema$Chapter } from '@/typings';
import classes from './ChapterListDrawer.module.scss';

interface Props extends Pick<ListRowProps, 'index' | 'style'> {
  bookID: string;
  chapter: Partial<Schema$Chapter>;
  onClick: () => void;
  isActive?: boolean;
}

export function ChapterListItem({ style, index, chapter = {} }: Props) {
  return (
    <div className={classes['list-item']} style={style}>
      <div className={classes['chapter-number']}>
        {chapter.number || index + 1}
      </div>
      <div className={classes['chapter-name']}>{chapter.name}</div>
    </div>
  );
}
