import React from 'react';
import { openConfirmDialog } from '@/components/ConfirmDialog';
import { Create, RequiredProps } from './createBookShelfItemActions';

export function withShareBookInShelf<P extends Create>(
  Component: React.ComponentType<P>
) {
  return function WithShareBookInShelf({
    bookID,
    shelf,
    actions,
    ...props
  }: P & RequiredProps) {
    return (
      <Component
        {...((props as unknown) as P)}
        text="分享書籍"
        icon="share"
        onClick={() =>
          openConfirmDialog({
            icon: 'warning-sign',
            title: 'Working in progress',
            confirmText: 'OK',
            cancelText: 'Close'
          })
        }
      />
    );
  };
}
