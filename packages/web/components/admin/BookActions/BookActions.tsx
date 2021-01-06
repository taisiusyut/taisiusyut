import React, { useMemo } from 'react';
import { Button, Popover, Menu, MenuItem } from '@blueprintjs/core';
import { BookStatus, UserRole } from '@/typings';
import { Book, OnUpdate, GetBookActionProps } from './bookActionCreator';
import { getDeleteBookActionProps } from './DeleteBook';
import { getUpdateBookActionProps } from './UpdateBook';
import { getFinishBookActionProps } from './FinishBook';
import { getPublishBookActionProps } from './PublishBook';

export interface BookActionsProps extends Book, OnUpdate {
  role?: UserRole;
}

export function BookActions({ role, book, onUpdate }: BookActionsProps) {
  const { updateBook, publishBook, finishBook, deleteBook } = useMemo(() => {
    const handler = (getter: GetBookActionProps) => {
      const props = getter({ book, onUpdate });
      return <MenuItem key={props.text} {...props} />;
    };
    return {
      updateBook: handler(getUpdateBookActionProps),
      finishBook: handler(getFinishBookActionProps),
      publishBook: handler(getPublishBookActionProps),
      deleteBook: handler(getDeleteBookActionProps)
    };
  }, [book, onUpdate]);

  const isAuthor = role === UserRole.Author;
  const isAdmin = role === UserRole.Root || role === UserRole.Admin;

  const menu = (
    <Menu>
      {isAuthor && updateBook}
      {isAuthor && book.status === BookStatus.Public && publishBook}
      {isAuthor && book.status === BookStatus.Private && finishBook}
      {isAdmin && book.status !== BookStatus.Deleted && deleteBook}
    </Menu>
  );

  return (
    <Popover position="left-top" content={menu}>
      <Button icon="more" minimal />
    </Popover>
  );
}
