import React from 'react';
import { Schema$Chapter } from '@/typings';
import { ClientBookChapterContent } from './ClientBookChapterContent';
import { GoBackButton } from '@/components/GoBackButton';
import { ButtonPopover } from '@/components/ButtonPopover';
import { ClientHeader } from '@/components/client/ClientHeader';
import { withChaptersListDrawer } from '@/components/client/ChapterListDrawer';
// import { BookShelfToggle } from '@/components/client/BookShelf/BookShelfToggle';
import { ClientPreferences } from '@/components/client/ClientPreferences';

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
  chapterNo,
  chapter
}: ClientBookChapterProps) {
  return (
    <>
      <ClientHeader
        title={chapter && `第${chapter.number}章 ${chapter.name}`}
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
              chapterNo={chapterNo}
              minimal
            />
          )
        ]}
      />
      {chapter && <ClientBookChapterContent chapter={chapter} />}
    </>
  );
}
