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

export interface ClientBookChapterData {
  bookID?: string;
  bookName: string;
  chapterNo: number;
  chapter: Schema$Chapter | null;
}

export interface ClientBookChapterProps extends ClientBookChapterData {}

const ChpaterListButton = withChaptersListDrawer(ButtonPopover);

// function getDirection(prev: number, next: number) {
//   const delta = next - prev;
//   switch (true) {
//     case delta > 0:
//       return 'down';
//     case delta < 0:
//       return 'up';
//     default:
//       return 'equal';
//   }
// }

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

  useEffect(() => {
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
          // const curScrollPos = scroller.scrollTop;
          // const oldScroll = scroller.scrollHeight - scroller.offsetHeight;

          setChapters(chapters => {
            if (!chapters.includes(newChapterNo)) {
              if (delta === 1 && hasNext.current) {
                return [...chapters, newChapterNo];
              } else if (newChapterNo >= 1) {
                // return [newChapterNo, ...chapters];
              }
            }
            return chapters;
          });

          const newTarget = document.querySelector<HTMLDivElement>(
            `#chapter-${newChapterNo}`
          );

          // if (delta === -1) {
          //   const newScroll = scroller.scrollHeight - scroller.offsetHeight;
          //   scroller.scrollTop = curScrollPos + newScroll - oldScroll;
          // }

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

  // const chapterName = data[currentChapter]?.name || '';
  const title = `${bookName} - 第${currentChapter}章`;
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
      </div>
    </>
  );
}
