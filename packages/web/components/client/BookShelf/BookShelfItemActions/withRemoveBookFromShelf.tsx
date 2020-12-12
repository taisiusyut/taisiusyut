import React from 'react';
import { Colors } from '@blueprintjs/core';
import { openConfirmDialog } from '@/components/ConfirmDialog';
import { removeBookFromShelf } from '@/service';
import { Create, RequiredProps } from './createBookShelfItemActions';

const text = '移出書架';
const icon = 'trash';

export function withRemoveBookFromShelf<P extends Create>(
  Component: React.ComponentType<P>
) {
  return function WithRemoveBookFromShelf({
    bookID,
    shelf,
    actions,
    ...props
  }: P & RequiredProps) {
    async function onConfirm() {
      await removeBookFromShelf(bookID);
      actions.delete({ bookID });
    }

    return (
      <Component
        {...((props as unknown) as P)}
        icon={icon}
        text={text}
        onClick={() => {
          openConfirmDialog({
            icon,
            intent: 'danger',
            title: text,
            confirmText: '確認',
            cancelText: '取消',
            onConfirm,
            children: (
              <div style={{ width: 260, lineHeight: '1.5em' }}>
                確認將「&nbsp;
                <b style={{ color: Colors.RED3 }}>
                  {shelf.byIds[bookID].book?.name}
                </b>
                &nbsp;」 從書架移除嗎？
              </div>
            )
          });
        }}
      />
    );
  };
}
