import React from 'react';
import Link from 'next/link';
import router from 'next/router';
import { Button, Card, Icon } from '@blueprintjs/core';
import { BookShelfToggle } from '@/components/client/BookShelf/BookShelfToggle';
import { useChapterListDrawer } from '@/components/client/ChapterListDrawer';
import { withBreakPoint } from '@/hooks/useBreakPoints';
import { Schema$Book } from '@/typings';
import classes from './ClientBookChaptersDrawer.module.scss';

export interface Props {
  book: Schema$Book;
  lastVisit?: number;
}

export function ClientBookChaptersDrawerTrigger({
  onClick
}: {
  onClick?: () => void;
}) {
  return (
    <Card interactive className={classes['trigger']} onClick={onClick}>
      <div className={classes['chapter-head']}>章節目錄</div>
      <Icon icon="chevron-right" />
    </Card>
  );
}

function NavigateButton({
  bookName,
  chapterNo
}: {
  bookName: string;
  chapterNo: number;
  prefix?: string;
}) {
  return (
    <Link href={`/book/${bookName}/chapter/${chapterNo}`}>
      <Button
        fill
        intent="primary"
        text={chapterNo === 1 ? '開始閱讀' : '繼續閱讀'}
      />
    </Link>
  );
}

function ClientBookChaptersDrawerComponent({ book, lastVisit }: Props) {
  const [openChapterListDrawer] = useChapterListDrawer(book.id);
  return (
    <div className={classes['content']}>
      <ClientBookChaptersDrawerTrigger
        onClick={() =>
          openChapterListDrawer({
            chapterNo: lastVisit,
            onItemClick: chapter =>
              chapter.number &&
              router.push(`/book/${book.name}/chapter/${chapter.number}`)
          })
        }
      ></ClientBookChaptersDrawerTrigger>
      <div className={classes['button-group']}>
        <NavigateButton bookName={book.name} chapterNo={lastVisit || 1} />
        <BookShelfToggle bookID={book.id} fill />
      </div>
    </div>
  );
}

export const ClientBookChaptersDrawer = withBreakPoint(
  ClientBookChaptersDrawerComponent,
  { validate: breakPoint => breakPoint <= 768 }
);
