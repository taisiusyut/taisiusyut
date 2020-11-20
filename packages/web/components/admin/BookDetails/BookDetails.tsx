import React, { useState } from 'react';
import { useRxAsync } from 'use-rx-hooks';
import { Schema$Book } from '@/typings';
import { useAuthState } from '@/hooks/useAuth';
import { getChapters } from '@/service/chapter';
import { BookDetailsHeader, OnUpdate } from './BookDetailsHeader';
import { BookDetailsChapters } from './BookDetailsChapters';

interface Props extends OnUpdate {
  book: Partial<Schema$Book> & Pick<Schema$Book, 'id'>;
}

export function BookDetails({ book, onUpdate }: Props) {
  const { user } = useAuthState();
  const [request] = useState(() => () => getChapters({ bookID: book.id }));
  const [chapters] = useRxAsync(request);

  return (
    <div>
      <BookDetailsHeader book={book} role={user?.role} onUpdate={onUpdate} />
      <BookDetailsChapters
        bookID={book.id}
        chapters={chapters.data?.data || []}
      />
    </div>
  );
}
