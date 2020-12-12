import { MouseEvent } from 'react';
import { IMenuItemProps } from '@blueprintjs/core';
import { BookShelfState, BookShelfActions } from '@/hooks/useBookShelf';
import { withGroupBookInShelf } from './withGroupBookInShelf';
import { withPinBookInShelf } from './withPinBookInShelf';
import { withRemoveBookFromShelf } from './withRemoveBookFromShelf';
import { withShareBookInShelf } from './withShareBookInShelf';

export interface Create extends Partial<Pick<IMenuItemProps, 'icon' | 'text'>> {
  onClick?: (event: MouseEvent<any>) => void;
}

export interface RequiredProps {
  bookID: string;
  shelf: BookShelfState;
  actions: BookShelfActions;
}

export interface Offset {
  top: number;
  left: number;
}

export function createBookShelfItemActions<P extends Create>(
  Component: React.ComponentType<P>
) {
  return {
    GroupBookInShelf: withGroupBookInShelf(Component),
    PinBookInShelf: withPinBookInShelf(Component),
    RemoveBookFromShelf: withRemoveBookFromShelf(Component),
    ShareBookInShelf: withShareBookInShelf(Component)
  };
}
