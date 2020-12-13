import React, { SyntheticEvent, useEffect, useRef, useState } from 'react';
import router from 'next/router';
import { fromEvent } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Schema$Chapter } from '@/typings';
import { GoBackButton } from '@/components/GoBackButton';
import { ButtonPopover } from '@/components/ButtonPopover';
import { ClientHeader } from '@/components/client/ClientHeader';
import { withChaptersListDrawer } from '@/components/client/ChapterListDrawer';
// import { BookShelfToggle } from '@/components/client/BookShelf/BookShelfToggle';
import { ClientPreferences } from '@/components/client/ClientPreferences';
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
  const ref = useRef<HTMLDivElement>(null);
  const hasNext = useRef(initialChapter ? initialChapter.hasNext : false);
  const loaded = useRef<Record<string, boolean>>({
    [initialChapterNo]: !!initialChapter
  });

  useEffect(() => {
    const scroller = ref.current;
    let chapterNo = initialChapterNo;
    let target = document.querySelector<HTMLDivElement>(
      `#chapter-${chapterNo}`
    );
    if (scroller && bookID) {
      const subscription = fromEvent<SyntheticEvent>(scroller, 'scroll')
        .pipe(
          map<SyntheticEvent, -1 | 1 | undefined>(() => {
            if (target) {
              const ref =
                scroller.scrollTop + scroller.offsetHeight + scroller.offsetTop;
              if (ref < target.offsetTop) {
                return -1;
              } else if (
                loaded.current[chapterNo] &&
                ref - 40 >= target.offsetTop + target.offsetHeight
              ) {
                return 1;
              }
            }
          }),
          filter((i): i is -1 | 1 => !!i)
        )
        .subscribe(delta => {
          const newChapterNo = chapterNo + delta;

          if (hasNext.current) {
            setChapters(chapters =>
              chapters.includes(newChapterNo)
                ? chapters
                : [...chapters, newChapterNo]
            );
          }

          const newTarget = document.querySelector<HTMLDivElement>(
            `#chapter-${newChapterNo}`
          );

          if (newTarget) {
            target = newTarget;
            chapterNo = newChapterNo;
            setCurrentChapter(chapterNo);
            const url = `/book/${bookName}/chapter/${chapterNo}`;
            router.replace(url, url, { shallow: true });
          }
        });
      return () => subscription.unsubscribe();
    }
  }, [bookID, bookName, initialChapter, initialChapterNo]);

  return (
    <>
      <ClientHeader
        title={`第${currentChapter}章 ${
          data[currentChapter]?.name || ''
        }`.trim()}
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
      <div className={classes['chapters']} ref={ref}>
        {bookID &&
          chapters.map(chapterNo => (
            <div
              key={chapterNo}
              className={classes['content']}
              id={`chapter-${chapterNo}`}
            >
              <ClientBookChapterContent
                bookID={bookID}
                chapterNo={chapterNo}
                defaultChapter={data[chapterNo]}
                onLoaded={chapter => {
                  if (hasNext.current === true) {
                    hasNext.current = chapter.hasNext;
                  }
                  loaded.current[chapter.number] = true;
                  ref.current?.dispatchEvent(new Event('scroll'));
                  setData(data => ({ ...data, [chapter.number]: chapter }));
                }}
              />
            </div>
          ))}
      </div>
    </>
  );
}
