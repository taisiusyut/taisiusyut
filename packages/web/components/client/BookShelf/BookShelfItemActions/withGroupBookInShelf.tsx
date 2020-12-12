import React from 'react';
import { openConfirmDialog } from '@/components/ConfirmDialog';
import { Create, RequiredProps } from './createBookShelfItemActions';

export function withGroupBookInShelf<P extends Create>(
  Component: React.ComponentType<P>
) {
  return function WithGroupBookInShelf({
    bookID,
    shelf,
    actions,
    ...props
  }: P & RequiredProps) {
    return (
      <Component
        {...((props as unknown) as P)}
        text="移到分組"
        icon="folder-open"
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
