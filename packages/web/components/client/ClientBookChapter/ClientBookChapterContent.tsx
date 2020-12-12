import React from 'react';
import { Schema$Chapter } from '@/typings';
import { useClientPreferencesState } from '@/hooks/useClientPreferences';
import classes from './ClientBookChapter.module.scss';

export interface Props {
  chapter: Schema$Chapter;
}

export function ClientBookChapterContent({ chapter }: Props) {
  const { fontSize, lineHeight } = useClientPreferencesState();

  if (chapter) {
    return (
      <div className={classes.content}>
        <div>
          {chapter.content.split('\n').map((paramgraph, idx) => (
            <p
              key={idx}
              className={classes.paramgraph}
              style={{ fontSize, lineHeight }}
            >
              {paramgraph}
            </p>
          ))}
        </div>
      </div>
    );
  }

  return null;
}
