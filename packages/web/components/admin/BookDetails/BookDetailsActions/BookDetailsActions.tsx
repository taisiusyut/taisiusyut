import React, { useMemo } from 'react';
import { Button, Popover, Menu, MenuItem } from '@blueprintjs/core';
import { BookStatus } from '@/typings';
import {
  Book,
  OnUpdate,
  GetBookDetailsActionProps
} from './bookDetailsActionCreator';
import { getUpdateBookActionProps } from './UpdateBook';
import { getFinishBookActionProps } from './FinishBook';
import { getPublishBookActionProps } from './PublishBook';

export interface BookDetailsActionsProps extends Book, OnUpdate {}

export function BookDetailsActions({
  book,
  onUpdate
}: BookDetailsActionsProps) {
  const { updateBook, publishBook, finishBook } = useMemo(() => {
    const handler = (getter: GetBookDetailsActionProps) => {
      const props = getter({ book, onUpdate });
      return <MenuItem key={props.text} {...props} />;
    };
    return {
      updateBook: handler(getUpdateBookActionProps),
      finishBook:
        book.status === BookStatus.Private && handler(getFinishBookActionProps),
      publishBook:
        book.status === BookStatus.Public && handler(getPublishBookActionProps)
    };
  }, [book, onUpdate]);

  const menu = (
    <Menu>
      {updateBook}
      {publishBook}
      {finishBook}
    </Menu>
  );

  return (
    <Popover position="left-top" content={menu}>
      <Button icon="more" minimal />
    </Popover>
  );
}
