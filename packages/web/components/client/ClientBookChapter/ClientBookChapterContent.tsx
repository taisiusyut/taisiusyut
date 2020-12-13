import React from 'react';
import { Schema$Chapter } from '@/typings';
import { useClientPreferencesState } from '@/hooks/useClientPreferences';
import classes from './ClientBookChapter.module.scss';

export interface Props {
  chapter: Schema$Chapter | null;
}

export function ClientBookChapterContent({ chapter }: Props) {
  const { fontSize, lineHeight } = useClientPreferencesState();

  if (chapter) {
    return (
      <div className={classes['content']}>
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
    );
  }

  return <div className={classes['content']}>404 Not Found</div>;
}
