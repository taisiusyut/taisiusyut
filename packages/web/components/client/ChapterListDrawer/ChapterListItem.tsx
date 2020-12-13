import React from 'react';
import { Schema$Chapter } from '@/typings';
import classes from './ChapterListDrawer.module.scss';
import { Icon } from '@blueprintjs/core';

type DivProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

interface Props extends DivProps {
  isActive?: boolean;
  chapter: Partial<Schema$Chapter>;
}

export function ChapterListItem({ isActive, chapter, ...props }: Props) {
  return (
    <div
      {...props}
      className={[classes['list-item'], isActive ? classes['active'] : '']
        .join(' ')
        .trim()}
    >
      <div className={classes['chapter-number']}>
        {isActive ? <Icon icon="map-marker" intent="danger" /> : chapter.number}
      </div>
      <div className={classes['chapter-name']}>{chapter.name}</div>
    </div>
  );
}
