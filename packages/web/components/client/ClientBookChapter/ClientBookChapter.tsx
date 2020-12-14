import React, {
  ReactNode,
  SyntheticEvent,
  useEffect,
  useRef,
  useState
} from 'react';
import router from 'next/router';
import { fromEvent } from 'rxjs';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';
import { Schema$Chapter } from '@/typings';
import { GoBackButton } from '@/components/GoBackButton';
import { ButtonPopover } from '@/components/ButtonPopover';
import { ClientHeader } from '@/components/client/ClientHeader';
import { withChaptersListDrawer } from '@/components/client/ChapterListDrawer';
// import { BookShelfToggle } from '@/components/client/BookShelf/BookShelfToggle';
import { ClientPreferences } from '@/components/client/ClientPreferences';
import { ClientBookChapterContent } from './ClientBookChapterContent';
import classes from './ClientBookChapter.module.scss';
import { useClientPreferencesState } from '@/hooks/useClientPreferences';
import { Button } from '@blueprintjs/core';

export interface ClientBookChapterData {
  bookID?: string;
  bookName: string;
  chapterNo: number;
  chapter: Schema$Chapter | null;
}

export interface ClientBookChapterProps extends ClientBookChapterData {}

const ChpaterListButton = withChaptersListDrawer(ButtonPopover);

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

  const { autoFetchNextChapter } = useClientPreferencesState();

  useEffect(() => {
    if (!autoFetchNextChapter) {
      return;
    }

    const scroller = scrollerRef.current;
    let chapterNo = initialChapterNo;
    let target = document.querySelector<HTMLDivElement>(
      `#chapter-${chapterNo}`
    );
    if (scroller && bookID) {
      const subscription = fromEvent<SyntheticEvent>(scroller, 'scroll')
        .pipe(
          map(() => scroller.scrollTop),
          distinctUntilChanged(),
          map<number, -1 | 1 | undefined>(scrollTop => {
            if (target && loaded.current[chapterNo]) {
              const pos =
                scrollTop + scroller.offsetHeight + scroller.offsetTop;

              if (
                scrollTop === 0 ||
                pos <=
                  target.offsetTop -
                    (parseFloat(window.getComputedStyle(target).marginTop) || 0)
              ) {
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

          if (delta === 1 && hasNext.current) {
            setChapters(chapters => {
              return chapters.includes(newChapterNo)
                ? chapters
                : [...chapters, newChapterNo];
            });
          }

          const newTarget = document.querySelector<HTMLDivElement>(
            `#chapter-${newChapterNo}`
          );

          if (newTarget) {
            target = newTarget;
            chapterNo = newChapterNo;
            setCurrentChapter(chapterNo);
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

  useEffect(() => {
    if (initialChapterNo !== currentChapter) {
      const url = `/book/${bookName}/chapter/${currentChapter}`;
      router.replace(url, url, { shallow: true });
    }
  }, [bookName, initialChapterNo, currentChapter]);

  const title = `第${currentChapter}章 - ${bookName}`;
  const header = (
    <ClientHeader
      title={title}
      left={
        <GoBackButton targetPath={['/', '/explore', `/book/${bookName}`]} />
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
            chapterNo={initialChapterNo}
            minimal
          />
        )
      ]}
    />
  );

  const content: ReactNode[] = [];
  const onLoaded = (chapter: Schema$Chapter) => {
    if (hasNext.current === true) {
      hasNext.current = chapter.hasNext;
    }
    loaded.current[chapter.number] = true;

    setData(data => ({ ...data, [chapter.number]: chapter }));

    // trigger checking after loaded
    // for small content or large screen
    scrollerRef.current?.dispatchEvent(new Event('scroll'));
  };

  if (bookID) {
    for (const chapterNo of chapters) {
      content.push(
        <div
          key={chapterNo}
          className={classes['content']}
          id={`chapter-${chapterNo}`}
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
            <div style={{ marginTop: 20, marginBottom: 20 }}>
              <Button
                fill
                text="下一章"
                intent="primary"
                onClick={() => {
                  const nextChpaterNo = currentChapter + 1;
                  setCurrentChapter(nextChpaterNo);
                  setChapters(chapters => [...chapters, nextChpaterNo]);
                }}
              />
            </div>
          )}
      </div>
    </>
  );
}
