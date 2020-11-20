import React from 'react';
import { GetServerSideProps } from 'next';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Chapter } from '@/components/admin/Chapter';
import { UserRole } from '@/typings';

interface Props {
  bookID: string;
}

export default function CreateChapterPage({ bookID }: Props) {
  return <Chapter bookID={bookID} />;
}

export const getServerSideProps: GetServerSideProps<Props> = async context => {
  const { bookID } = context.query;
  if (typeof bookID === 'string') {
    return {
      props: {
        bookID
      }
    };
  }
  throw new Error(`BookID must be a string`);
};

CreateChapterPage.layout = AdminLayout;
CreateChapterPage.access = [UserRole.Author];
CreateChapterPage.redirect = '/admin';
