import React, { useEffect, useCallback, useRef, useState } from 'react';
import router from 'next/router';
import { fromEvent, merge } from 'rxjs';
import { distinctUntilChanged, filter, map, pairwise } from 'rxjs/operators';
import { Button } from '@blueprintjs/core';
import { Schema$Chapter } from '@/typings';
import { useChapterListDrawer } from '@/components/client/ChapterListDrawer';
import { GoBackButton } from '@/components/GoBackButton';
import {
  ClientBookError,
  useGetBookByName
} from '@/components/client/ClientBookError';
import { openClientPreferences } from '@/components/client/ClientPreferencesOverlay';
import {
  Preferences,
  useClientPreferences
} from '@/hooks/useClientPreferences';
import { useGoBack } from '@/hooks/useGoBack';
import { useLastVisitChapter } from '@/hooks/useBookShelf';
import { lastVisitStorage } from '@/utils/storage';
import { FixedChapterName } from './FixedChapterName';
import { ClientChapterHeader } from './ClientChapterHeader';
import { ClientChapterOverlay } from './ClientChapterOverlay';
import {
  ClientChapterContent,
  ClientChapterContentLoading
} from './ClientChapterContent';
import classes from './ClientChapter.module.scss';

export type ClientChapterParams = {
  bookName: string;
  chapterNo: number;
};

export interface ClientChapterData extends ClientChapterParams {
  bookID: string | null;
  chapter: Schema$Chapter | null;
}

export interface ClientChapterProps extends Omit<ClientChapterData, 'bookID'> {
  bookID?: string;
  openClientPreferences: () => void;
  preferences: Preferences;
}

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

const getMarginY = (el: Element) => {
  const style = window.getComputedStyle(el);
  return parseInt(style.marginTop, 10) + parseInt(style.marginBottom, 10);
};

export const formatChapterTitle = (chapterNo: number, bookName: string) =>
  `${bookName} | 第${chapterNo}章 | 睇小說`;

const goBackButton = (
  <GoBackButton targetPath={['/', `/book/:bookName`, '/featured']} />
);

function ClientChapterComponment({
  bookName,
  bookID,
  chapter: initialChapter,
  chapterNo: initialChapterNo,
  preferences,
  openClientPreferences
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
  const { fontSize, lineHeight, autoFetchNextChapter } = preferences;

  const _openChapterListDrawer = () =>
    openChapterListDrawer({
      chapterNo: currentChapter,
      onItemClick: chapter => gotoChapter(bookName, chapter.number)
    });

  const navigateChapter = (factor: 1 | -1) => {
    const chapterNo = currentChapter + factor;
    const idx = currentChapter + factor - 1;

    if (chapterNo <= 0) return alert(`沒有上一章節`);
    if (factor === 1) {
      // true if not sure has next chapter?
      if (
        !loaded.current[currentChapter] &&
        !chapters[idx]?.number // chapters could be empty array;
      ) {
        return alert(`請刷新頁面或者稍後再試`);
      } else if (!hasNext.current) {
        return alert(`沒有下一章節`);
      }
    }
    return gotoChapter(bookName, chapterNo);
  };

  const handleChapterLoaded = useCallback((chapter: Schema$Chapter) => {
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
              } else if (
                pos >=
                target.offsetTop + target.offsetHeight + getMarginY(target)
              ) {
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

  useEffect(() => {
    document.title = formatChapterTitle(currentChapter, bookName);
    lastVisitStorage.set(bookName, currentChapter);
  }, [currentChapter, bookName]);

  useLastVisitChapter(bookID, currentChapter);

  // disable scroll resotration for page refresh
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      const defaultScrollRestoration = window.history.scrollRestoration;
      window.history.scrollRestoration = 'manual';
      return () => {
        window.history.scrollRestoration = defaultScrollRestoration;
      };
    }
  }, []);

  if (bookID) {
    const chapterName =
      data[currentChapter]?.name || chapters[currentChapter - 1]?.name || '';
    const title = `第${currentChapter}章 ${chapterName}`;
    const content = chapterNums.map(chapterNo => (
      <div
        key={chapterNo}
        // changing id format should also check `preload.js`
        id={`chapter-${chapterNo}`}
        className={classes['content']}
        style={{ fontSize, lineHeight }}
      >
        <ClientChapterContent
          bookID={bookID}
          chapterNo={chapterNo}
          onLoaded={handleChapterLoaded}
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
          openClientPreferences={openClientPreferences}
          openChapterListDrawer={_openChapterListDrawer}
        />
        <ClientChapterOverlay
          isOpen={showOverlay}
          bookName={bookName}
          goBackButton={goBackButton}
          navigateChapter={navigateChapter}
          openClientPreferences={openClientPreferences}
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

  return null;
}

export function ClientChapter({
  bookName,
  chapter,
  chapterNo,
  bookID: initialBookID,
  ...props
}: ClientChapterData & Partial<ClientChapterParams>) {
  const [preferences, preferencesActions] = useClientPreferences();
  const handleOpenClientPreferences = () =>
    openClientPreferences({
      preferences: preferences,
      onUpdate: preferencesActions.update
    });

  const book = useGetBookByName(bookName, !!initialBookID);
  const bookID = book.data?.id || initialBookID;

  if (
    typeof bookID === 'string' &&
    typeof bookName === 'string' &&
    typeof chapterNo === 'number' &&
    typeof chapter !== 'undefined'
  ) {
    return (
      <ClientChapterComponment
        {...props}
        bookID={bookID}
        bookName={bookName}
        chapter={chapter}
        chapterNo={chapterNo}
        preferences={preferences}
        openClientPreferences={handleOpenClientPreferences}
      />
    );
  }

  return (
    <div className={classes['container']}>
      <ClientChapterHeader
        goBackButton={goBackButton}
        openClientPreferences={handleOpenClientPreferences}
        openChapterListDrawer={() => void 0}
      />
      {book.notFound ? (
        <ClientBookError {...book} bookName={bookName} />
      ) : (
        <div className={classes['scroller']}>
          <div>
            <div className={classes['content']}>
              {ClientChapterContentLoading}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
