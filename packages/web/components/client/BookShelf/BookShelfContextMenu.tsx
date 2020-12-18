import React, { ComponentType } from 'react';
import {
  Classes,
  IMenuItemProps,
  IMenuProps,
  Menu,
  MenuItem,
  Overlay
} from '@blueprintjs/core';
import {
  withBookDetails,
  RequiredProps,
  createBookShelfItemActions,
  BookShelfItemActionsProps
} from './BookShelfItemActions';

interface Props extends IMenuProps, RequiredProps {}

const GotoBookDetails = withBookDetails(MenuItem);

const {
  GroupBookInShelf,
  PinBookInShelf,
  RemoveBookFromShelf,
  ShareBookInShelf
} = createBookShelfItemActions(
  MenuItem as ComponentType<Partial<IMenuItemProps>>
);

export function BookShelfMenu({ bookID, shelf, actions, ...props }: Props) {
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

export function BookShelfContextMenu({
  offset,
  bookID,
  shelf,
  actions,
  ...props
}: BookShelfItemActionsProps) {
  return (
    <Overlay {...props} hasBackdrop={false}>
      <div className={Classes.POPOVER} style={offset}>
        <BookShelfMenu
          bookID={bookID}
          shelf={shelf}
          actions={actions}
          onClick={props.onClose}
        />
      </div>
    </Overlay>
  );
}
