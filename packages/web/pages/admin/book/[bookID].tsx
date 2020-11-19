import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import { useRxAsync } from 'use-rx-hooks';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { BookDetails } from '@/components/admin/BookDetails';
import { UserRole } from '@/typings';
import { getBook } from '@/service';

interface Props {
  bookID: string;
}

export default function BookDetailsPage({ bookID }: Props) {
  const [request] = useState(() => () => getBook({ id: bookID }));
  const [{ data: book }] = useRxAsync(request);
  return <BookDetails book={book || { id: bookID }} />;
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
