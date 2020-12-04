import React from 'react';
import { Schema$Chapter } from '@/typings';
import classes from './ClientBookChapter.module.scss';

export interface Props {
  chapter: Schema$Chapter;
}

export function ClientBookChapterContent({ chapter }: Props) {
  if (chapter) {
    return (
      <div className={classes.content}>
        <div>
          {chapter.content.split('\n').map((paramgraph, idx) => (
            <p className={classes.paramgraph} key={idx}>
              {paramgraph}
            </p>
          ))}
        </div>
      </div>
    );
  }

  return null;
}
