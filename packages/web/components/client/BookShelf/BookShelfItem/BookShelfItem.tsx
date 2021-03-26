import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Button, Popover } from '@blueprintjs/core';
import { BookModel } from '@/components/BookModel';
import { Skelecton } from '@/components/Skelecton';
import { BookShelf, useBookShelf } from '@/hooks/useBookShelf';
import { useContextMenu, UseContextMenuEvent } from '@/hooks/useContextMenu';
import { isTouchable } from '@/constants';
import { lastVisitStorage } from '@/utils/storage';
import { openBookShelfItemActions, Offset } from '../openBookShelfItemActions';
import { RequiredProps } from '../BookShelfItemActions';
import { BookShelfMenu } from '../BookShelfContextMenu';
import { BookDeletedNotice } from './BookDeletedNotice';
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

function ActionButton(props: RequiredProps) {
  const [render, setRender] = useState(false);
  useEffect(() => setRender(!isTouchable()), []);
  return render ? (
    <div className={classes['action-button']}>
      <Popover position="bottom" content={<BookShelfMenu {...props} />}>
        <Button minimal icon="more" />
      </Popover>
    </div>
  ) : null;
}

const bookModelWidth = 55;
// const RemoveBookButton = withRemoveBookFromShelf(Button);

export function BookShelfItem({ data }: Props) {
  const [shelf, actions] = useBookShelf();
  const { asPath } = useRouter();
  const { book, latestChapter, lastVisit } = data;

  const [ref] = useContextMenu<HTMLDivElement>(
    event =>
      book &&
      openBookShelfItemActions({
        bookID: book.id,
        shelf,
        actions,
        offset: getOffset(event)
      })
  );

  const className = classes['item'];

  // if `skelecton` is a space can disable `Skelecton` fallback
  const content = (flatten: boolean, disableSkelecton = false) => (
    <div className={classes['item-body']}>
      <BookModel width={bookModelWidth} flatten={flatten} />
      <div className={classes['item-content']}>
        <div className={classes['book-name']}>
          <Skelecton length={3}>{book?.name}</Skelecton>
        </div>
        <div className={classes['book-author']}>
          <Skelecton length={4}>
            {book?.authorName && `${book.authorName} 著`}
          </Skelecton>
        </div>
        <div className={classes['book-latest-chapter']}>
          <Skelecton length={5} disabled={disableSkelecton}>
            {latestChapter && `連載至 ${latestChapter.name}`}
          </Skelecton>
        </div>
      </div>
    </div>
  );

  if (book) {
    const basePath = `/book/${book.name}`;
    const active = decodeURIComponent(asPath).startsWith(basePath);
    const _lastVisit = lastVisit || lastVisitStorage.get(book.name, 1);

    return (
      <div
        ref={ref}
        className={[className, active ? classes['active'] : '']
          .join(' ')
          .trim()}
      >
        <Link href={`${basePath}/chapter/${_lastVisit}`} prefetch={false}>
          {/* Should not use <a /> since it have conflict with context menu in In iPhone safari */}
          {content(active, true)}
        </Link>
        <ActionButton bookID={book.id} shelf={shelf} actions={actions} />
      </div>
    );
  }

  if (data.bookID === data.id) {
    return (
      <div className={className}>
        <BookDeletedNotice id={data.id} onSuccess={actions.delete} />
      </div>
    );
  }

  return <div className={className}>{content(false)}</div>;
}
