import React from 'react';
import { Button, Popover, Menu, MenuItem } from '@blueprintjs/core';
import { Schema$Book, BookStatus, UserRole } from '@/typings';
import { withPublishBook } from './PublishBook';
import { withFinishBook } from './FinishBook';
import { withUpdateBook } from './UpdateBook';

export interface OnUpdate {
  onUpdate: (payload: Partial<Schema$Book>) => void;
}

interface Props extends OnUpdate {
  book: Partial<Schema$Book> & Pick<Schema$Book, 'id'>;
  role?: UserRole;
}

const PublishBook = withPublishBook(MenuItem);
const FinishBook = withFinishBook(MenuItem);
const UpdateBook = withUpdateBook(MenuItem);

export function BookDetailsActions({ book, onUpdate }: Props) {
  const menu = (
    <Menu>
      <UpdateBook text="Update Book" book={book} onUpdate={onUpdate} />
      {book.status === BookStatus.Private && (
        <PublishBook text="Publish Book" book={book} onUpdate={onUpdate} />
      )}
      {book.status === BookStatus.Public && (
        <FinishBook text="Finish Book" book={book} onUpdate={onUpdate} />
      )}
    </Menu>
  );

  return (
    <Popover position="left-top" content={menu}>
      <Button icon="more" minimal />
    </Popover>
  );
}
