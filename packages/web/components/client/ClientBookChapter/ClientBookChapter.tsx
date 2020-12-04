import React from 'react';
import { Schema$Chapter } from '@/typings';
import { ClientBookChapterContent } from './ClientBookChapterContent';
import { HistoryBackButton } from '@/components/HistoryBackButton';
import { ClientHeader } from '@/components/client/ClientHeader';

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
        left={
          <HistoryBackButton
            fallbackURL={chapter ? `/book/${bookName}` : '/'}
          />
        }
      />
      {chapter && <ClientBookChapterContent chapter={chapter} />}
    </>
  );
}
