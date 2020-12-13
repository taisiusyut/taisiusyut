import React from 'react';
import { Schema$Chapter } from '@/typings';
import { ClientBookChapterContent } from './ClientBookChapterContent';
import { GoBackButton } from '@/components/GoBackButton';
import { ClientHeader } from '@/components/client/ClientHeader';
// import { BookShelfToggle } from '@/components/client/BookShelf/BookShelfToggle';
import { ClientPreferences } from '@/components/client/ClientPreferences';
import { ChapterListDrawer } from '../ChapterListDrawer';

export interface ClientBookChapterData {
  bookID?: string;
  bookName: string;
  chapterNo: number;
  chapter: Schema$Chapter | null;
}

export interface ClientBookChapterProps extends ClientBookChapterData {}

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
        left={<GoBackButton targetPath={['/', `/book/${bookName}`]} />}
        right={[<ClientPreferences key="0" />]}
      />
      {bookID && (
        <ChapterListDrawer
          isOpen={true}
          bookID={bookID}
          chapterNo={chapterNo}
        />
      )}
      {chapter && <ClientBookChapterContent chapter={chapter} />}
    </>
  );
}
