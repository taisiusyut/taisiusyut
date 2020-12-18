import React from 'react';
import { Drawer, Icon } from '@blueprintjs/core';
import { Schema$BookShelf } from '@/typings';
import { BookModel } from '@/components/BookModel';
import {
  withBookDetails,
  Create,
  createBookShelfItemActions,
  BookShelfItemActionsProps
} from '../BookShelfItemActions';
import classes from './BookShelfDrawer.module.scss';

type DivProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

interface Props extends BookShelfItemActionsProps {}

interface HeaderProps extends DivProps {
  book?: Schema$BookShelf['book'];
}

interface GridProps extends Omit<DivProps, 'onClick'>, Create {}

const GotoBookDetails = withBookDetails(DrawerHeader);

const {
  GroupBookInShelf,
  PinBookInShelf,
  RemoveBookFromShelf,
  ShareBookInShelf
} = createBookShelfItemActions(Grid);

function DrawerHeader({ book, ...props }: HeaderProps) {
  return (
    <div {...props} className={classes['drawer-header']}>
      <BookModel width={40} />
      <div>
        <div className={classes['book-name']}>{book?.name}</div>
        <div className={classes['book-author']}>{book?.author.nickname}</div>
      </div>
      <div>
        書籍詳情
        <Icon icon="chevron-right" />
      </div>
    </div>
  );
}

function Grid({ text, icon, ...props }: GridProps) {
  return (
    <div {...props} className={classes['grid']}>
      <Icon icon={icon} />
      <div className={classes['grid-text']}>{text}</div>
    </div>
  );
}

export function BookShelfDrawer({
  bookID,
  shelf,
  actions,
  offset,
  ...props
}: Props) {
  const { book } = shelf.byIds[bookID];

  const itemProps = {
    bookID,
    shelf,
    actions
  };

  return (
    <Drawer
      {...props}
      autoFocus
      size="auto"
      position="bottom"
      portalClassName={classes['portal']}
      className={classes['drawer']}
    >
      <div onClick={props.onClose}>
        <GotoBookDetails {...itemProps} book={book} />
        <div className={classes['drawer-content']}>
          <PinBookInShelf {...itemProps} />
          <GroupBookInShelf {...itemProps} />
          <ShareBookInShelf {...itemProps} />
          <RemoveBookFromShelf {...itemProps} />
        </div>
      </div>
    </Drawer>
  );
}
