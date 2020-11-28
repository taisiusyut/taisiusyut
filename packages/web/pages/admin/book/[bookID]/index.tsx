import React, { useState } from 'react';
import router from 'next/router';
import { useRxAsync } from 'use-rx-hooks';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { BookDetails } from '@/components/admin/BookDetails';
import { UserRole, Schema$Book } from '@/typings';
import { getBook } from '@/service';

interface Props {
  bookID: string;
}

type BookState = Partial<Schema$Book> & Pick<Schema$Book, 'id'>;

function BookDetailsPageContent({ bookID }: Props) {
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

export default function BookDetailsPage() {
  const { bookID } = router.query;
  if (typeof bookID !== 'string') {
    return null;
  }
  return <BookDetailsPageContent bookID={bookID} />;
}

BookDetailsPage.layout = AdminLayout;
BookDetailsPage.access = [UserRole.Root, UserRole.Admin, UserRole.Author];
BookDetailsPage.redirect = '/admin';
