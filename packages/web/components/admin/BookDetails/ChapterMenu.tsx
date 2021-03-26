import React from 'react';
import router from 'next/router';
import {
  Classes,
  Menu,
  MenuItem,
  Overlay,
  IOverlayProps,
  MenuDivider
} from '@blueprintjs/core';
import { ChapterStatus, Schema$Chapter } from '@/typings';
import { publishChapter } from '@/service';
import { createOpenOverlay } from '@/utils/openOverlay';
import {
  CRUDActionCreators,
  CRUDActionTypes,
  Dispatched
} from '@/hooks/crud-reducer';
import { Toaster } from '@/utils/toaster';
import { Book } from '../BookActions';

interface ChapterMenuProps extends Book, Partial<IOverlayProps> {
  offset: { top: number; left: number };
  title?: string;
  chapter: Schema$Chapter;
  actions: Dispatched<
    CRUDActionCreators<Schema$Chapter, 'id', CRUDActionTypes<any>>
  >;
}

export const openChapterMenu = createOpenOverlay<ChapterMenuProps>(ChapterMenu);

export const gotoChapter = (bookID: string, chapterID?: string) => {
  let pathname = `/admin/book/${bookID}/chapters`;
  if (chapterID) {
    pathname += `/${chapterID}`;
  }
  return router.push(pathname);
};

export function ChapterMenu({
  book,
  offset,
  chapter,
  onClose,
  actions,
  ...props
}: ChapterMenuProps) {
  return (
    <Overlay
      {...props}
      onClose={onClose}
      hasBackdrop={false}
      transitionDuration={0}
    >
      <div className={Classes.POPOVER} style={offset}>
        <Menu onClick={event => onClose && onClose(event)}>
          <MenuItem
            icon="edit"
            text="編輯章節"
            onClick={() => gotoChapter(book.id, chapter.id)}
          />
          <MenuItem
            icon="share"
            text="瀏覽章節"
            onClick={() =>
              window.open(`/book/${book.name}/chapter/${chapter.number}`)
            }
          />
          {chapter.status === ChapterStatus.Private && (
            <MenuItem
              text="發佈章節"
              icon="globe-network"
              onClick={() =>
                publishChapter({ bookID: book.id, chapterID: chapter.id })
                  .then(actions.update)
                  .catch(error => Toaster.apiError(`發佈章節失敗`, error))
              }
            />
          )}
          <MenuDivider />
          <MenuItem icon="cross" text="關閉" />
        </Menu>
      </div>
    </Overlay>
  );
}
