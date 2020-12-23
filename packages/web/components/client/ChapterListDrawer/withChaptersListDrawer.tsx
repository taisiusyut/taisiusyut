import React, { MouseEvent, useState } from 'react';
import dynamic from 'next/dynamic';
import router from 'next/router';
import { Drawer } from '@blueprintjs/core';
import { useRxAsync } from 'use-rx-hooks';
import type { ChapterListDrawerContentProps } from './ChapterListDrawerContent';
import { getChapters } from '@/service';
import { Order, PaginateResult, Schema$Chapter } from '@/typings';
import { Toaster } from '@/utils/toaster';

export interface OnClick {
  onClick?: (event: MouseEvent<any>) => void;
}

interface Props {
  bookID: string;
  bookName: string;
  chapterNo: number;
}

interface GotoChapterOpts {
  bookName: string;
  chapterNo: number;
  shallow?: boolean;
}

const ChapterListDrawerContent = dynamic<ChapterListDrawerContentProps>(
  () =>
    import(`./ChapterListDrawerContent`).then(
      ({
        /* webpackChunkName: "chapters-list-drawer" */ ChapterListDrawerContent
      }) => ChapterListDrawerContent
    ),
  { ssr: false }
);

const onFailure = Toaster.apiError.bind(Toaster, 'Get chapters failure');

export const gotoChapter = ({
  bookName,
  chapterNo,
  shallow = false
}: GotoChapterOpts) =>
  // use replace should be better for mobile device
  router.replace(`/book/${bookName}/chapter/${chapterNo}`, undefined, {
    shallow
  });

export function withChaptersListDrawer<P extends OnClick>(
  Component: React.ComponentType<P>
) {
  return function WithChaptersListDrawer({
    bookID,
    bookName,
    chapterNo,
    ...props
  }: P & Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const handleClose = () => setIsOpen(false);

    const [chapters, setChapters] = useState<Partial<Schema$Chapter>[]>(
      Array.from({ length: 30 }, () => ({}))
    );

    const [{ request, onSuccess }] = useState(() => {
      return {
        request: () =>
          getChapters({
            bookID,
            pageSize: 9999,
            sort: { createdAt: Order.ASC }
          }),
        onSuccess: (payload: PaginateResult<Schema$Chapter>) => {
          setChapters(payload.data);
          setLoaded(true);
        }
      };
    });

    const [{ loading }] = useRxAsync(request, {
      defer: !isOpen || loaded,
      onSuccess,
      onFailure
    });

    return (
      <>
        <Component
          {...((props as unknown) as P)}
          onClick={() => setIsOpen(true)}
        />
        <Drawer size="auto" isOpen={isOpen} onClose={handleClose}>
          <ChapterListDrawerContent
            loading={loading}
            bookID={bookID}
            chapters={chapters}
            chapterNo={chapterNo}
            onReverse={() =>
              setChapters(chapters => chapters.slice().reverse())
            }
            onItemClick={chapter => {
              if (chapter.number) {
                handleClose();
                gotoChapter({ bookName, chapterNo: chapter.number });
              }
            }}
          />
        </Drawer>
      </>
    );
  };
}
