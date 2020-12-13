import React, { useState } from 'react';
import { useRxAsync } from 'use-rx-hooks';
import { useClientPreferencesState } from '@/hooks/useClientPreferences';
import { getChapterByNo } from '@/service';
import { Schema$Chapter } from '@/typings';
import classes from './ClientBookChapter.module.scss';
export interface Props {
  bookID: string;
  chapterNo: number;
  defaultChapter?: Schema$Chapter;
  onLoaded: (chapter: Schema$Chapter) => void;
}

export function ClientBookChapterContent({
  bookID,
  chapterNo,
  onLoaded,
  defaultChapter
}: Props) {
  const { fontSize, lineHeight } = useClientPreferencesState();
  const [{ request, onSuccess }] = useState(() => {
    return {
      onSuccess: (chapter: Schema$Chapter) => {
        onLoaded(chapter);
      },
      request: () => getChapterByNo({ bookID, chapterNo })
    };
  });

  const [{ data: chapter = defaultChapter, loading }] = useRxAsync(request, {
    defer: !!defaultChapter,
    onSuccess
  });

  if (loading) {
    return <div>loading ...</div>;
  }

  if (chapter) {
    return (
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
    );
  }

  return <div>404 Not Found</div>;
}
