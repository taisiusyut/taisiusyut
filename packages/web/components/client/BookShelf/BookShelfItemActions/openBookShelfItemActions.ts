import { IOverlayProps } from '@blueprintjs/core';
import { createOpenOverlay } from '@/utils/openOverlay';
import { isTouchable } from '@/constants';
import { RequiredProps } from './createBookShelfItemActions';
import { BookShelfItemDrawer } from './BookShelfItemDrawer';
import { BookShelfItemContextMenu } from './BookShelfItemMenu';

export interface Offset {
  top: number;
  left: number;
}

export interface BookShelfItemActionsProps
  extends Partial<IOverlayProps>,
    RequiredProps {
  offset?: Offset;
}

const openDrawer = createOpenOverlay<BookShelfItemActionsProps>(
  BookShelfItemDrawer
);

const openMenu = createOpenOverlay<BookShelfItemActionsProps>(
  BookShelfItemContextMenu
);

export const openBookShelfItemActions = (props: BookShelfItemActionsProps) => {
  return isTouchable ? openDrawer(props) : openMenu(props);
};
