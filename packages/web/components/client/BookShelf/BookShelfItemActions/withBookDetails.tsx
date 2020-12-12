import React from 'react';
import router from 'next/router';
import { Create, RequiredProps } from './createBookShelfItemActions';

export function withBookDetails<P extends Create>(
  Component: React.ComponentType<P>
) {
  return function WithBookDetails({
    bookID,
    shelf,
    actions,
    ...props
  }: P & RequiredProps) {
    return (
      <Component
        {...((props as unknown) as P)}
        onClick={() => router.push(`/book/${shelf.byIds[bookID].book?.name}`)}
      />
    );
  };
}
