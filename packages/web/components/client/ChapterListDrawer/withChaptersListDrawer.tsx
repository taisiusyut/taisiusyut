import React, { MouseEvent, useState } from 'react';
import dynamic from 'next/dynamic';
import type { ChapterListDrawerProps } from './ChapterListDrawer';

export interface OnClick {
  onClick?: (event: MouseEvent<any>) => void;
}

const ChapterListDrawer = dynamic<ChapterListDrawerProps>(
  () =>
    import(`./ChapterListDrawer`).then(
      ({ /* webpackChunkName: "chapters-list-drawer" */ ChapterListDrawer }) =>
        ChapterListDrawer
    ),
  { ssr: false }
);

export function withChaptersListDrawer<P extends OnClick>(
  Component: React.ComponentType<P>
) {
  return function WithChaptersListDrawer({
    bookID,
    bookName,
    chapterNo,
    ...props
  }: P & Pick<ChapterListDrawerProps, 'bookID' | 'bookName' | 'chapterNo'>) {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <Component
          {...((props as unknown) as P)}
          onClick={() => setIsOpen(true)}
        />
        <ChapterListDrawer
          bookID={bookID}
          bookName={bookName}
          chapterNo={chapterNo}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />
      </>
    );
  };
}
