import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Button, IButtonProps } from '@blueprintjs/core';
import { BookModel } from '@/components/BookModel';
import { BookShelf, useBookShelf } from '@/hooks/useBookShelf';
import { useContextMenu, UseContextMenuEvent } from '@/hooks/useContextMenu';
import { isTouchable } from '@/constants';
import { openBookShelfItemActions, Offset } from '../openBookShelfItemActions';
import classes from './BookShelfItem.module.scss';

interface Props {
  data: BookShelf;
}

function getOffset<T extends HTMLElement>(
  event: UseContextMenuEvent<T>
): Offset | undefined {
  if (window.TouchEvent && event instanceof TouchEvent) {
    return {
      top: event.touches[0].clientY,
      left: event.touches[0].clientX
    };
  } else if ('clientX' in event && 'clientY' in event) {
    return { top: event.clientY, left: event.clientX };
  }
}

function ActionButton(props: IButtonProps) {
  const [render, setRender] = useState(false);
  useEffect(() => setRender(!isTouchable()), []);
  return render ? (
    <div className={classes['action-button']}>
      <Button {...props} icon="more" minimal />
    </div>
  ) : null;
}

export function BookShelfItem({
  data: { book, latestChapter, lastVisit }
}: Props) {
  const { asPath } = useRouter();

  const className = [classes['item']];

  const [shelf, actions] = useBookShelf();

  const openActions = (event: UseContextMenuEvent<HTMLElement>) =>
    book &&
    openBookShelfItemActions({
      bookID: book.id,
      shelf,
      actions,
      offset: getOffset(event)
    });

  const [ref] = useContextMenu<HTMLDivElement>(openActions);

  const content = (flatten: boolean) => (
    <div className={classes['item-body']}>
      <BookModel width={55} flatten={flatten} />
      <div className={classes['item-content']}>
        <div className={classes['book-name']}>{book?.name}</div>
        <div className={classes['book-author']}>
          {book?.authorName && `${book.authorName} 著`}
        </div>
        <div className={classes['book-latest-chapter']}>
          {latestChapter && `連載至 ${latestChapter.name}`}
        </div>
      </div>
    </div>
  );

  if (book) {
    const basePath = `/book/${book.name}`;
    const active = decodeURIComponent(asPath).startsWith(basePath);

    return (
      <div
        ref={ref}
        className={[...className, active ? classes['active'] : '']
          .join(' ')
          .trim()}
      >
        <Link href={`${basePath}/chapter/${lastVisit || 1}`}>
          {/* Should not use <a /> since it have conflict with context menu in In iPhone safari */}
          {content(active)}
        </Link>
        <ActionButton onClick={openActions} />
      </div>
    );
  }

  return (
    <div className={[...className, classes['skeleton']].join(' ').trim()}>
      {content(false)}
    </div>
  );
}
