import React, { useEffect, useCallback, useRef, useState } from 'react';
import router from 'next/router';
import { fromEvent, merge } from 'rxjs';
import { distinctUntilChanged, filter, map, pairwise } from 'rxjs/operators';
import { Button } from '@blueprintjs/core';
import { Schema$Chapter } from '@/typings';
import { useChapterListDrawer } from '@/components/client/ChapterListDrawer';
import { GoBackButton } from '@/components/GoBackButton';
import { openClientPreferences } from '@/components/client/ClientPreferencesDialog';
import { useClientPreferences } from '@/hooks/useClientPreferences';
import { useGoBack } from '@/hooks/useGoBack';
import { FixedChapterName } from './FixedChapterName';
import { ClientChapterHeader } from './ClientChapterHeader';
import { ClientChapterOverlay } from './ClientChapterOverlay';
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

async function gotoChapter(
  bookName: string,
  chapterNo: number | undefined,
  shallow = false
) {
  if (typeof chapterNo === 'number') {
    await router.replace(`/book/${bookName}/chapter/${chapterNo}`, undefined, {
      shallow
    });
  }
}

const getTarget = (chapterNo: number) =>
  document.querySelector<HTMLDivElement>(`#chapter-${chapterNo}`);

export const getChapterTitle = (chapterName: string, bookName: string) =>
  `${chapterName} | ${bookName} | 睇小說`;

export function ClientChapter({
  bookID,
  bookName,
  chapter: initialChapter,
  chapterNo: initialChapterNo
}: ClientChapterProps) {
  const [chapterNums, setChapterNums] = useState([initialChapterNo]);
  const [currentChapter, setCurrentChapter] = useState(initialChapterNo);

  // `chapters` and `data` are similiar but not same
  // The chapter value in `chapters` contain the required data for chapter list only
  // But data contain all property of a chapter
  const [openChapterListDrawer, chapters] = useChapterListDrawer(bookID);
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

  const [showOverlay, setShowOverlay] = useState(false);
  const [preferences, preferencesActions] = useClientPreferences();
  const { fontSize, lineHeight, autoFetchNextChapter } = preferences;

  const _openChapterListDrawer = () =>
    openChapterListDrawer({
      chapterNo: currentChapter,
      onItemClick: chapter => gotoChapter(bookName, chapter.number)
    });
  const _openClientPreferences = () =>
    openClientPreferences({
      preferences: preferences,
      onUpdate: preferencesActions.update
    });

  const navigateChapter = (factor: 1 | -1) => {
    const idx = currentChapter + factor - 1;
    const chapter = chapters[idx];
    if (!chapters.length) return alert(`請刷新頁面或者稍後再試`);
    if (!chapter) return alert(factor === 1 ? `沒有下一章節` : `沒有上一章節`);
    if (!chapter.number) return alert(`發生錯誤，請刷新頁面`);
    return gotoChapter(bookName, chapter.number);
  };

  const onLoaded = useCallback((chapter: Schema$Chapter) => {
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
  }, []);

  useEffect(() => {
    const scroller = scrollerRef.current;
    let chapterNo = initialChapterNo;

    if (!scroller) {
      return;
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

    setChapterNums(chapterNums => {
      if (chapterNums.includes(initialChapterNo)) {
        scrollToTarget();
        return chapterNums;
      }

      if (initialChapterNo === chapterNums[0] - 1) {
        setTimeout(scrollToTarget, 0);
        return [initialChapterNo, ...chapterNums];
      }

      if (initialChapterNo === chapterNums[chapterNums.length - 1] + 1) {
        setTimeout(scrollToTarget, 0);
        return [...chapterNums, initialChapterNo];
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
          setShowOverlay(false);
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
            setChapterNums(chapterNums => {
              return chapterNums.includes(newChapterNo)
                ? chapterNums
                : [...chapterNums, newChapterNo];
            });
          }

          const newTarget = getTarget(newChapterNo);
          if (newTarget) {
            chapterNo = newChapterNo;
            setCurrentChapter(chapterNo);
            gotoChapter(bookName, chapterNo, true).then(() => {
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

  useEffect(() => {
    hasNext.current = data[currentChapter]?.hasNext;
  }, [data, currentChapter]);

  const chapterName =
    data[currentChapter]?.name || chapters[currentChapter - 1]?.name || '';

  useEffect(() => {
    if (chapterName) {
      const handler = (url: string) => {
        if (decodeURI(url).indexOf(bookName) !== -1) {
          document.title = getChapterTitle(chapterName, bookName);
        }
      };
      router.events.on('routeChangeComplete', handler);
      return () => router.events.off('routeChangeComplete', handler);
    }
  }, [chapterName, bookName]);

  if (bookID) {
    const title = `第${currentChapter}章 ${chapterName}`;
    const content = chapterNums.map(chapterNo => (
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
    ));

    const nextChapter = !autoFetchNextChapter &&
      hasNext.current &&
      loaded.current[currentChapter] && (
        <div className={classes['next-chapter']}>
          <Button
            fill
            text="下一章"
            intent="primary"
            onClick={() => {
              const nextChpaterNo = currentChapter + 1;
              setChapterNums(chapterNums => [...chapterNums, nextChpaterNo]);
            }}
          />
        </div>
      );

    const goBackButton = (
      <GoBackButton targetPath={['/', `/book/${bookName}`, '/featured']} />
    );

    return (
      <div
        className={[classes['container'], classes[scrollDirection]]
          .join(' ')
          .trim()}
      >
        <FixedChapterName title={title} />
        <ClientChapterHeader
          title={title}
          goBackButton={goBackButton}
          openClientPreferences={_openClientPreferences}
          openChapterListDrawer={_openChapterListDrawer}
        />
        <ClientChapterOverlay
          isOpen={showOverlay}
          bookName={bookName}
          goBackButton={goBackButton}
          navigateChapter={navigateChapter}
          openClientPreferences={_openClientPreferences}
          openChapterListDrawer={_openChapterListDrawer}
          onClose={() => setShowOverlay(false)}
        />
        <div ref={scrollerRef} className={classes['scroller']}>
          <div onClick={() => setShowOverlay(true)}>{content}</div>
          {nextChapter}
        </div>
      </div>
    );
  }

  // TODO:
  return <div>Not Found</div>;
}
