import React, { useState } from 'react';
import router from 'next/router';
import { useRxAsync } from 'use-rx-hooks';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { BookDetails } from '@/components/admin/BookDetails';
import { UserRole, Schema$Book } from '@/typings';
import { getBook } from '@/service';

type BookState = Partial<Schema$Book> & Pick<Schema$Book, 'id'>;

export default function BookDetailsPage() {
  const { bookID } = router.query;

  if (typeof bookID !== 'string') {
    throw new Error(`bookID is ${bookID}`);
  }

  const [book, setBook] = useState<BookState>({
    id: bookID
  });
  const [{ request, onUpdate }] = useState({
    request: () => getBook({ id: bookID }),
    onUpdate: (payload?: Partial<Schema$Book>) =>
      setBook(book => ({ ...book, ...payload }))
  });

  useRxAsync(request, { onSuccess: setBook });

  return <BookDetails book={book} onUpdate={onUpdate} />;
}

BookDetailsPage.layout = AdminLayout;
BookDetailsPage.access = [UserRole.Root, UserRole.Admin, UserRole.Author];
BookDetailsPage.redirect = '/admin';
