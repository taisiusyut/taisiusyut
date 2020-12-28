import React, { useEffect, useRef, useState } from 'react';
import { Drawer } from '@blueprintjs/core';
import {
  ChapterListDrawerContent,
  ChapterListDrawerContentProps
} from './ChapterListDrawerContent';
import { getChapters } from '@/service';
import { Order, Schema$Chapter } from '@/typings';
import { Toaster } from '@/utils/toaster';
import { createOpenOverlay } from '@/utils/openOverlay';

interface ChapterListDrawerProps extends ChapterListDrawerContentProps {
  isOpen?: boolean;
  onClose: () => void;
  onClosed: () => void;
}

const openChapterListDrawer = createOpenOverlay(ChapterListDrawer);

export function ChapterListDrawer({
  chapterNo,
  isOpen,
  onClose,
  onClosed,
  onItemClick,
  ...props
}: ChapterListDrawerProps) {
  return (
    <Drawer size="auto" isOpen={isOpen} onClose={onClose} onClosed={onClosed}>
      <ChapterListDrawerContent
        {...props}
        chapterNo={chapterNo}
        onItemClick={chapter => {
          onClose();
          onItemClick(chapter);
        }}
      />
    </Drawer>
  );
}

export function useChapterListDrawer(bookID?: string) {
  const [chapters, setChapters] = useState<Partial<Schema$Chapter>[]>(
    Array.from({ length: 30 }, () => ({}))
  );
  const drawer = useRef<ReturnType<typeof openChapterListDrawer>>();

  async function openDrawer(
    props: Pick<ChapterListDrawerContentProps, 'chapterNo' | 'onItemClick'>
  ) {
    const loaded = !chapters[0].name;
    const _handler = openChapterListDrawer({
      ...props,
      chapters,
      loading: !loaded,
      onReverse: chapters => {
        _handler.update({ chapters: chapters.slice().reverse() });
      }
    });
    drawer.current = _handler;
  }

  useEffect(() => {
    if (bookID) {
      const request = async () => {
        try {
          const { data: chapters } = await getChapters({
            bookID,
            pageSize: 9999,
            sort: { createdAt: Order.ASC }
          });
          setChapters(chapters);
          drawer.current?.update({ chapters, loading: false });
          return chapters;
        } catch (error) {
          Toaster.apiError.bind('Get chapters failure', error);
          drawer.current?.update({ chapters: [], loading: false });
          throw error;
        }
      };

      if ('requestIdleCallback' in window && 'cancelIdleCallback' in window) {
        const id = window.requestIdleCallback(request);
        return () => window.cancelIdleCallback(id);
      } else {
        const timeout = setTimeout(request, 2000);
        return () => clearTimeout(timeout);
      }
    }
  }, [bookID]);

  return [openDrawer, chapters] as const;
}
