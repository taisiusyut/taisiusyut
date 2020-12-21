import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { fromEvent, merge } from 'rxjs';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';
import { Button } from '@blueprintjs/core';
import { Schema$Chapter } from '@/typings';
import { GoBackButton } from '@/components/GoBackButton';
import { ButtonPopover } from '@/components/ButtonPopover';
import { ClientHeader } from '@/components/client/ClientLayout';
import {
  gotoChapter,
  withChaptersListDrawer
} from '@/components/client/ChapterListDrawer';
import { ClientPreferences } from '@/components/client/ClientPreferences';
import { useClientPreferencesState } from '@/hooks/useClientPreferences';
import { ClientBookChapterContent } from './ClientBookChapterContent';
import classes from './ClientBookChapter.module.scss';

export interface ClientBookChapterData {
  bookID?: string;
  bookName: string;
  chapterNo: number;
  chapter: Schema$Chapter | null;
}

export interface ClientBookChapterProps extends ClientBookChapterData {}

const ChpaterListButton = withChaptersListDrawer(ButtonPopover);

const getTarget = (chapterNo: number) =>
  document.querySelector<HTMLDivElement>(`#chapter-${chapterNo}`);

export function ClientBookChapter({
  bookID,
  bookName,
  chapter: initialChapter,
  chapterNo: initialChapterNo
}: ClientBookChapterProps) {
  const [chapters, setChapters] = useState([initialChapterNo]);
  const [currentChapter, setCurrentChapter] = useState(initialChapterNo);
  const [data, setData] = useState<Record<number, Schema$Chapter>>(
    initialChapter ? { [initialChapter.number]: initialChapter } : {}
  );
  const scrollerRef = useRef<HTMLDivElement>(null);
  const hasNext = useRef(initialChapter ? initialChapter.hasNext : false);
  const loaded = useRef<Record<string, boolean>>({
    [initialChapterNo]: !!initialChapter
  });

  const {
    autoFetchNextChapter,
    fontSize,
    lineHeight
  } = useClientPreferencesState();

  useEffect(() => {
    const scroller = scrollerRef.current;
    let chapterNo = initialChapterNo;

    if (!scroller) {
      throw new Error(`scroller is not defined`);
    }

    const scrollTo = (x: number, y: number) => {
      // true if not scrollable
      if (scroller.scrollHeight === scroller.offsetHeight) {
        window.scrollTo(x, y);
      } else {
        scroller.scrollLeft = x;
        scroller.scrollTop = y;
      }
    };

    const scrollToTarget = () => {
      const offsetTop = getTarget(initialChapterNo)?.offsetTop;
      if (typeof offsetTop === 'number') {
        scrollTo(0, offsetTop - scroller.offsetTop);
      }
    };

    setCurrentChapter(initialChapterNo);

    setChapters(chapters => {
      if (chapters.includes(initialChapterNo)) {
        scrollToTarget();
        return chapters;
      }

      if (initialChapterNo === chapters[0] - 1) {
        setTimeout(scrollToTarget, 0);
        return [initialChapterNo, ...chapters];
      }

      if (initialChapterNo === chapters[chapters.length - 1] + 1) {
        setTimeout(scrollToTarget, 0);
        return [...chapters, initialChapterNo];
      }

      scrollTo(0, 0);

      return [initialChapterNo];
    });

    if (bookID) {
      const scroller$ = fromEvent(scroller, 'scroll').pipe(
        map(
          () =>
            [
              scroller.scrollTop,
              scroller.offsetHeight + scroller.offsetTop
            ] as const
        )
      );

      // For iPhone safari, since the toolbar will be hidden if `window` is scrolling down
      const windowScroll$ = fromEvent(window, 'scroll').pipe(
        map(() => [window.scrollY, window.innerHeight] as const)
      );

      const subscription = merge(scroller$, windowScroll$)
        .pipe(
          distinctUntilChanged(([x], [y]) => x === y),
          map(([scrollTop, offsetHeight]): -1 | 1 | undefined => {
            const target = getTarget(chapterNo);
            if (target) {
              const pos = scrollTop + offsetHeight;
              if (scrollTop === 0 || pos <= target.offsetTop) {
                return -1;
              } else if (pos >= target.offsetTop + target.offsetHeight) {
                return 1;
              }
            }
          }),
          filter((i): i is -1 | 1 => !!i)
        )
        .subscribe(delta => {
          const newChapterNo = chapterNo + delta;

          if (
            delta === 1 &&
            hasNext.current &&
            autoFetchNextChapter &&
            loaded.current[chapterNo]
          ) {
            setChapters(chapters => {
              return chapters.includes(newChapterNo)
                ? chapters
                : [...chapters, newChapterNo];
            });
          }

          const newTarget = getTarget(newChapterNo);
          if (newTarget) {
            chapterNo = newChapterNo;
            setCurrentChapter(chapterNo);
            gotoChapter({ bookName, chapterNo, shallow: true });
          }
        });

      return () => subscription.unsubscribe();
    }
  }, [
    bookID,
    bookName,
    initialChapter,
    initialChapterNo,
    autoFetchNextChapter
  ]);

  const title = `第${currentChapter}章`;
  const header = (
    <ClientHeader
      title={title}
      left={
        <GoBackButton targetPath={['/', '/featured', `/book/${bookName}`]} />
      }
      right={[
        <ClientPreferences key="0" />,
        bookID && (
          <ChpaterListButton
            key="1"
            icon="properties"
            content="章節目錄"
            bookID={bookID}
            bookName={bookName}
            chapterNo={currentChapter}
            minimal
          />
        )
      ]}
    />
  );

  useEffect(() => {
    hasNext.current = data[currentChapter]?.hasNext;
  }, [data, currentChapter]);

  const content: ReactNode[] = [];
  const onLoaded = (chapter: Schema$Chapter) => {
    hasNext.current = chapter.hasNext;
    loaded.current[chapter.number] = true;

    setData(data => ({ ...data, [chapter.number]: chapter }));

    // trigger checking after loaded
    // for small content or large screen
    scrollerRef.current?.dispatchEvent(new Event('scroll'));
    window.dispatchEvent(new Event('scroll'));
  };

  if (bookID) {
    for (const chapterNo of chapters) {
      content.push(
        <div
          key={chapterNo}
          id={`chapter-${chapterNo}`}
          className={classes['content']}
          style={{ fontSize, lineHeight }}
        >
          <ClientBookChapterContent
            bookID={bookID}
            chapterNo={chapterNo}
            onLoaded={onLoaded}
            defaultChapter={data[chapterNo]}
          />
        </div>
      );
    }
  }

  return (
    <>
      {header}
      <div className={classes['chapters']} ref={scrollerRef}>
        {content}
        {!autoFetchNextChapter &&
          hasNext.current &&
          loaded.current[currentChapter] && (
            <div className={classes['next-chapter']}>
              <Button
                fill
                text="下一章"
                intent="primary"
                onClick={() => {
                  const nextChpaterNo = currentChapter + 1;
                  setChapters(chapters => [...chapters, nextChpaterNo]);
                }}
              />
            </div>
          )}
      </div>
    </>
  );
}
