import React, { SyntheticEvent, useEffect, useRef, useState } from 'react';
import { Schema$Chapter } from '@/typings';
import { ClientBookChapterContent } from './ClientBookChapterContent';
import { GoBackButton } from '@/components/GoBackButton';
import { ButtonPopover } from '@/components/ButtonPopover';
import { ClientHeader } from '@/components/client/ClientHeader';
import { withChaptersListDrawer } from '@/components/client/ChapterListDrawer';
// import { BookShelfToggle } from '@/components/client/BookShelf/BookShelfToggle';
import { ClientPreferences } from '@/components/client/ClientPreferences';
import classes from './ClientBookChapter.module.scss';
import { fromEvent, defer } from 'rxjs';
import { exhaustMap, filter, map, pairwise, tap } from 'rxjs/operators';
import { getChapterByNo } from '@/service';

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
  const [chapters, setChapters] = useState([initialChapter]);
  const [currentChapter, setCurrentChapter] = useState(initialChapter);
  const [hasNext, setHasNext] = useState(
    initialChapter ? initialChapter.hasNext : false
  );
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scroller = ref.current;
    let chapterNoRef = initialChapterNo;
    if (scroller && bookID) {
      const subscription = fromEvent<SyntheticEvent>(scroller, 'scroll')
        .pipe(
          map<SyntheticEvent, number | undefined>(() => {
            if (scroller.scrollTop === 0) {
              // return -1;
            } else if (
              hasNext &&
              scroller.scrollTop + scroller.offsetHeight >=
                scroller.scrollHeight
            ) {
              return 1;
            }
          }),
          filter((i): i is number => !!i),
          exhaustMap(plus => {
            const chapterNo = chapterNoRef + plus;
            return defer(() => getChapterByNo({ bookID, chapterNo })).pipe(
              tap(() => {
                chapterNoRef = chapterNo;
              })
            );
          })
        )
        .subscribe(chapter => {
          setHasNext(chapter.hasNext);
          setChapters(chapters => [...chapters, chapter]);
        });
      return () => subscription.unsubscribe();
    }
  }, [bookID, initialChapter, initialChapterNo, hasNext]);

  return (
    <>
      <ClientHeader
        title={
          currentChapter &&
          `第${currentChapter.number}章 ${currentChapter.name}`
        }
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
        {chapters.map((chapter, idx) => (
          <React.Fragment key={chapter?.id || idx}>
            <ClientBookChapterContent chapter={chapter} />
            <div id={`chapter-${chapter?.number}`}></div>
          </React.Fragment>
        ))}
      </div>
    </>
  );
}
