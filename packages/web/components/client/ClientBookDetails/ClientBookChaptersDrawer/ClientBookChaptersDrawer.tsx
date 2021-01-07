import React from 'react';
import router from 'next/router';
import { Button, Card, Icon } from '@blueprintjs/core';
import { BookShelfToggle } from '@/components/client/BookShelf/BookShelfToggle';
import { useChapterListDrawer } from '@/components/client/ChapterListDrawer';
import { withBreakPoint } from '@/hooks/useBreakPoints';
import { Schema$Book } from '@/typings';
import classes from './ClientBookChaptersDrawer.module.scss';
import { useBookShelfState } from '@/hooks/useBookShelf';
import { lastVisitStorage } from '@/utils/storage';
import Link from 'next/link';

export interface Props {
  book: Schema$Book;
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

function NavigateButton({ book }: { book: Schema$Book }) {
  const { byIds } = useBookShelfState();
  const chapterNo =
    byIds[book.id]?.lastVisit || lastVisitStorage.get(book.name, 1);

  return (
    <Link href={`/book/${book.name}/chapter/${chapterNo}`}>
      <Button
        fill
        intent="primary"
        text={chapterNo === 1 ? '第一章' : '繼續閱讀'}
      />
    </Link>
  );
}

function ClientBookChaptersDrawerComponent({ book }: Props) {
  const [openChapterListDrawer] = useChapterListDrawer(book.id);
  return (
    <div className={classes['content']}>
      <ClientBookChaptersDrawerTrigger
        onClick={() =>
          openChapterListDrawer({
            onItemClick: chapter =>
              chapter.number &&
              router.push(`/book/${book.name}/chapter/${chapter.number}`)
          })
        }
      ></ClientBookChaptersDrawerTrigger>
      <div className={classes['button-group']}>
        <NavigateButton book={book} />
        <BookShelfToggle bookID={book.id} fill />
      </div>
    </div>
  );
}

export const ClientBookChaptersDrawer = withBreakPoint(
  ClientBookChaptersDrawerComponent,
  { validate: breakPoint => breakPoint <= 768 }
);
