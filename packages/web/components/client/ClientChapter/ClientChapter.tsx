import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { fromEvent, merge } from 'rxjs';
import { distinctUntilChanged, filter, map, pairwise } from 'rxjs/operators';
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
import { useGoBack } from '@/hooks/useGoBack';
import { FixedChapterName } from './FixedChapterName';
import { ClientChapterContent } from './ClientChapterContent';
import classes from './ClientChapter.module.scss';

export interface ClientChapterData {
  bookID?: string;
  bookName: string;
  chapterNo: number;
  chapter: Schema$Chapter | null;
}

export interface ClientChapterProps extends ClientChapterData {}

type ScrollDirection = 'up' | 'down' | 'unknown';

const ChpaterListButton = withChaptersListDrawer(ButtonPopover);

const getTarget = (chapterNo: number) =>
  document.querySelector<HTMLDivElement>(`#chapter-${chapterNo}`);

export function ClientChapter({
  bookID,
  bookName,
  chapter: initialChapter,
  chapterNo: initialChapterNo
}: ClientChapterProps) {
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
  const { setRecords } = useGoBack();
  const [scrollDirection, setScrollDirection] = useState<ScrollDirection>(
    'unknown'
  );
  const [showMenu, setShowMenu] = useState(false);

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

    const isWindowScrollable = () =>
      scroller.scrollHeight === scroller.offsetHeight;

    const scrollTo = (x: number, y: number) => {
      if (isWindowScrollable()) {
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

    const scroller$ = fromEvent(scroller, 'scroll').pipe(
      map(
        () =>
          [
            scroller.scrollTop,
            scroller.offsetHeight + scroller.offsetTop
          ] as const
      )
    );

    const windowScroll$ = fromEvent(window, 'scroll').pipe(
      map(
        () =>
          [
            Math.min(
              Math.max(0, window.scrollY),
              document.documentElement.offsetHeight
            ), // Math min/max for safari
            window.innerHeight
          ] as const
      )
    );

    if (bookID) {
      const source$ = merge(scroller$, windowScroll$);

      const scrollDirSubscription = source$
        .pipe(
          map(([scrollTop]) => scrollTop),
          pairwise(),
          map(([prev, curr]) => curr - prev),
          filter(delta => delta !== 0),
          map((delta): ScrollDirection => (delta > 0 ? 'down' : 'up'))
        )
        .subscribe(direction => {
          setShowMenu(false);
          setScrollDirection(direction);
        });

      const chapterUpdateSubscription = source$
        .pipe(
          distinctUntilChanged(([x], [y]) => x === y),
          map(([scrollTop, offsetHeight]): -1 | 1 | undefined => {
            const target = getTarget(chapterNo);
            if (target) {
              const pos = scrollTop + offsetHeight;
              // Note: should not use both <= and >= for checking
              if (pos < target.offsetTop) {
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
            gotoChapter({ bookName, chapterNo, shallow: true }).then(() => {
              // remove the record so goback will be correctly
              setRecords(records => {
                return records.slice(0, records.length - 1);
              });
            });
          }
        });

      return () => {
        scrollDirSubscription.unsubscribe();
        chapterUpdateSubscription.unsubscribe();
      };
    }
  }, [
    bookID,
    bookName,
    initialChapter,
    initialChapterNo,
    autoFetchNextChapter,
    setRecords
  ]);

  const chapterName = data[currentChapter]?.name || '';
  const title = `第${currentChapter}章 ${chapterName}`;
  const header = (
    <ClientHeader
      className={classes['header']}
      title={title}
      left={[
        <GoBackButton
          key="0"
          targetPath={['/', '/featured', `/book/${bookName}`]}
        />,
        <span key="1" />
      ]}
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

    // trigger checking after loaded, for small content or large screen.
    // should not dispatch both at the same time because one of the value of `scrollTop` must be 0
    // and hence -1 may return and cause conflict
    if (window.scrollY) {
      window.dispatchEvent(new Event('scroll'));
    } else {
      scrollerRef.current?.dispatchEvent(new Event('scroll'));
    }
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
          <ClientChapterContent
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
    <div
      className={[
        classes['container'],
        showMenu ? classes['menu'] : '',
        classes[scrollDirection]
      ]
        .join(' ')
        .trim()}
    >
      <FixedChapterName title={title} />
      {header}
      <div ref={scrollerRef} className={classes['scroller']}>
        <div onClick={() => setShowMenu(flag => !flag)}>{content}</div>
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
    </div>
  );
}
