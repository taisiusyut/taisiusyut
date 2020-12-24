import React from 'react';
import { openShareDialog } from '@/components/client/ShareDialog';
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
    function handleClick() {
      const bookName = shelf.byIds[bookID].book?.name;
      if (!bookName) {
        return alert(`發生錯誤`);
      }

      const url = `${window.location.origin}/book/${bookName}`;
      if ('share' in navigator) {
        navigator.share({ url });
      } else {
        openShareDialog({ url, text: '' });
      }
    }

    return (
      <Component
        {...((props as unknown) as P)}
        text="分享書籍"
        icon="share"
        onClick={handleClick}
      />
    );
  };
}
