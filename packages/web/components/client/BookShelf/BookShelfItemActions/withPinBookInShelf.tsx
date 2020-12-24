import React from 'react';
import { openConfirmDialog } from '@/components/ConfirmDialog';
import { Create, RequiredProps } from './createBookShelfItemActions';

export function withPinBookInShelf<P extends Create>(
  Component: React.ComponentType<P>
) {
  return function WithPinBookInShelf({
    bookID,
    shelf,
    actions,
    ...props
  }: P & RequiredProps) {
    const data = shelf.byIds[bookID];
    return (
      <Component
        {...((props as unknown) as P)}
        text={data.pin ? '取消置頂' : '置頂書籍'}
        icon={data.pin ? 'unpin' : 'pin'}
        onClick={() => {
          // actions.delete(data);
          // actions.insert(data, 0);
          // actions.update({ ...data, pin: !data.pin });
          openConfirmDialog({
            icon: 'warning-sign',
            title: 'Working in progress',
            confirmText: 'OK',
            cancelText: 'Close'
          });
        }}
      />
    );
  };
}
