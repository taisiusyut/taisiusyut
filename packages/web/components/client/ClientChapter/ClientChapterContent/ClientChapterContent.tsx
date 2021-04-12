import React, { useCallback, useMemo } from 'react';
import { useRxAsync } from 'use-rx-hooks';
import { Button, Icon } from '@blueprintjs/core';
import { getChapterByNo, getErrorMessage } from '@/service';
import { Schema$Chapter } from '@/typings';
import { parseChapterContent } from '@/utils/chapterContent';
import { useAuthState } from '@/hooks/useAuth';
import { Paragraph } from './Paragraph';
import classes from './ClientChapterContent.module.scss';

export interface Props {
  bookID: string;
  chapterNo: number;
  defaultChapter?: Schema$Chapter;
  onLoaded: (chapter: Schema$Chapter) => void;
}

export const ClientChapterContentLoading = (
  <div className={classes['loading']}>LOADING</div>
);

export const ClientChapterContent = React.memo(
  ({ bookID, chapterNo, onLoaded, defaultChapter }: Props) => {
    const { loginStatus } = useAuthState();
    const waitingAuth = loginStatus === 'unknown' || loginStatus === 'loading';
    const request = useCallback(() => getChapterByNo({ bookID, chapterNo }), [
      bookID,
      chapterNo
    ]);

    const [{ data: chapter = defaultChapter, error }, { fetch }] = useRxAsync(
      request,
      {
        defer: !!defaultChapter || waitingAuth,
        onSuccess: onLoaded
      }
    );

    const content = useMemo(
      () => (chapter ? parseChapterContent(chapter.content) : []),
      [chapter]
    );

    if (error) {
      const handleRetry = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation(); // prevent trigger showOverlay in `ClientChapter`
        event.preventDefault();
        fetch();
      };

      return (
        <div className={classes['error']}>
          <div>
            <div>
              <Icon icon="warning-sign" iconSize={50} intent="warning" />
            </div>
            <div>{error ? getErrorMessage(error) : '未知錯誤'}</div>
            <Button intent="primary" onClick={handleRetry}>
              重試
            </Button>
          </div>
        </div>
      );
    }

    if (chapter) {
      const prefix = chapter.prefix || `第${chapterNo}章`;

      return (
        <>
          <div className={classes['chapter-name']}>
            {`${prefix} ${chapter.name}`}
          </div>
          {content.map((content, idx) => (
            <Paragraph
              key={idx}
              className={classes['paragraph']}
              content={content}
            />
          ))}
        </>
      );
    }

    return ClientChapterContentLoading;
  }
);

ClientChapterContent.displayName = 'ClientChapterContent';
