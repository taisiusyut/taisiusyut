import React from 'react';
import { Schema$Chapter } from '@/typings';
import { ClientBookChapterContent } from './ClientBookChapterContent';
import { GoBackButton } from '@/components/GoBackButton';
import { ClientHeader } from '@/components/client/ClientHeader';
// import { BookShelfToggle } from '@/components/client/BookShelf/BookShelfToggle';
import { ClientPreferences } from '@/components/client/ClientPreferences';

export interface ClientBookChapterData {
  bookName: string;
  chapterNo: number;
  chapter: Schema$Chapter | null;
}

export interface ClientBookChapterProps extends ClientBookChapterData {}

export function ClientBookChapter({
  bookName,
  chapter
}: ClientBookChapterProps) {
  return (
    <>
      <ClientHeader
        title={chapter && `第${chapter.number}章 ${chapter.name}`}
        left={<GoBackButton targetPath={chapter ? `/book/${bookName}` : '/'} />}
        right={[<ClientPreferences key="0" />]}
      />
      {chapter && <ClientBookChapterContent chapter={chapter} />}
    </>
  );
}
