import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import { useRxAsync } from 'use-rx-hooks';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { BookDetails } from '@/components/admin/BookDetails';
import { UserRole } from '@/typings';
import { getBook } from '@/service';
import { Schema$Book } from '@fullstack/server/dist/typings';

interface Props {
  bookID: string;
}

type BookState = Partial<Schema$Book> & Pick<Schema$Book, 'id'>;

export default function BookDetailsPage({ bookID }: Props) {
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

export const getServerSideProps: GetServerSideProps<Props> = async context => {
  if (typeof context.query.bookID !== 'string') {
    throw new Error(`context.query.bookID is ${context.query.bookID}`);
  }

  return {
    props: {
      bookID: context.query.bookID
    }
  };
};
