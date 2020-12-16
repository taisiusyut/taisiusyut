import React, { useState } from 'react';
import { useRxAsync } from 'use-rx-hooks';
import { Button, Icon } from '@blueprintjs/core';
import { getChapterByNo, getErrorMessage } from '@/service';
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
  const [{ request, onSuccess }] = useState(() => {
    return {
      onSuccess: onLoaded,
      request: () => getChapterByNo({ bookID, chapterNo })
    };
  });

  const [
    { data: chapter = defaultChapter, loading, error },
    { fetch }
  ] = useRxAsync(request, {
    defer: !!defaultChapter,
    onSuccess
  });

  if (loading) {
    return <div className={classes['loading']}>LOADING</div>;
  }

  if (chapter) {
    return (
      <div>
        <div className={classes['chapter-name']}>
          {`第${chapterNo}章 ${chapter.name}`}
        </div>
        <div>
          {chapter.content.split('\n').map((paramgraph, idx) => (
            <p key={idx} className={classes['paragraph']}>
              {paramgraph}
            </p>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={classes['error']}>
      <div>
        <div>
          <Icon icon="warning-sign" iconSize={50} intent="warning" />
        </div>
        <div>{error ? getErrorMessage(error) : '未知錯誤'}</div>
        <Button intent="primary" onClick={fetch}>
          重試
        </Button>
      </div>
    </div>
  );
}
