import { IOverlayProps } from '@blueprintjs/core';
import { createOpenOverlay } from '@/utils/openOverlay';
import { isTouchable } from '@/utils/isTouchable';
import { RequiredProps, Offset } from './BookShelfItemActions';
import { BookShelfDrawer } from './BookShelfDrawer';
import { BookShelfContextMenu } from './BookShelfContextMenu';

export type { Offset } from './BookShelfItemActions';

export interface BookShelfItemActionsProps
  extends Partial<IOverlayProps>,
    RequiredProps {
  offset?: Offset;
}

const openDrawer = createOpenOverlay(BookShelfDrawer);

const openMenu = createOpenOverlay<BookShelfItemActionsProps>(
  BookShelfContextMenu
);

export const openBookShelfItemActions = (props: BookShelfItemActionsProps) => {
  return isTouchable() ? openDrawer(props) : openMenu(props);
};
