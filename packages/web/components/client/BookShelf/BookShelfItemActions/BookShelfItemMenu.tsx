import React, { ComponentType } from 'react';
import {
  Classes,
  IMenuItemProps,
  IMenuProps,
  Menu,
  MenuItem,
  Overlay
} from '@blueprintjs/core';
import { withBookDetails } from './withBookDetails';
import { BookShelfItemActionsProps } from './openBookShelfItemActions';
import {
  RequiredProps,
  createBookShelfItemActions
} from './createBookShelfItemActions';

interface Props extends IMenuProps, RequiredProps {}

interface ContextProps extends BookShelfItemActionsProps {}

const GotoBookDetails = withBookDetails(MenuItem);

const {
  GroupBookInShelf,
  PinBookInShelf,
  RemoveBookFromShelf,
  ShareBookInShelf
} = createBookShelfItemActions(
  MenuItem as ComponentType<Partial<IMenuItemProps>>
);

export function BookShelfItemMenu({ bookID, shelf, actions, ...props }: Props) {
  const itemProps = { bookID, shelf, actions };
  return (
    <Menu {...props}>
      <GotoBookDetails {...itemProps} text="書籍詳情" icon="book" />
      <PinBookInShelf {...itemProps} />
      <RemoveBookFromShelf {...itemProps} />
      <GroupBookInShelf {...itemProps} />
      <ShareBookInShelf {...itemProps} />
    </Menu>
  );
}

export function BookShelfItemContextMenu({
  offset,
  bookID,
  shelf,
  actions,
  ...props
}: ContextProps) {
  return (
    <Overlay {...props} hasBackdrop={false}>
      <div className={Classes.POPOVER} style={offset}>
        <BookShelfItemMenu
          bookID={bookID}
          shelf={shelf}
          actions={actions}
          onClick={props.onClose}
        />
      </div>
    </Overlay>
  );
}
