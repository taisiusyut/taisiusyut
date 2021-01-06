import React, { useState } from 'react';
import router from 'next/router';
import { useRxAsync } from 'use-rx-hooks';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { BookDetails } from '@/components/admin/BookDetails';
import { Toaster } from '@/utils/toaster';
import { UserRole, Schema$Book } from '@/typings';
import { getBook } from '@/service';

interface Props {
  bookID: string;
}

type BookState = Partial<Schema$Book> & Pick<Schema$Book, 'id'>;

const onFailure = Toaster.apiError.bind(Toaster, `Get book failure`);

function BookDetailsPageContent({ bookID }: Props) {
  const [book, setBook] = useState<BookState>({
    id: bookID
  });
  const [{ request, onSuccess }] = useState({
    request: () => getBook({ id: bookID }),
    onSuccess: (payload?: Partial<Schema$Book>) =>
      payload
        ? setBook(book => ({ ...book, ...payload }))
        : router.push('/admin/book')
  });

  useRxAsync(request, { onSuccess: setBook, onFailure });

  return <BookDetails book={book} onSuccess={onSuccess} />;
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
