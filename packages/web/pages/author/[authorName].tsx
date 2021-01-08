import React from 'react';
import { GetServerSideProps } from 'next';
import { ClientLayout } from '@/components/client/ClientLayout';
import {
  ClientAuthor,
  ClientAuthorProps,
  ClientAuthorParams
} from '@/components/client/ClientAuthor';
import { Meta } from '@/components/Meta';
import { getAuthorController, serialize } from '@/service/server';
import { Schema$Author } from '@/typings';

export const getServerSideProps: GetServerSideProps<
  ClientAuthorProps,
  ClientAuthorParams
> = async context => {
  const { authorName } = context.query;

  if (typeof authorName !== 'string') {
    throw new Error(
      `expect authorName to be string but received ${authorName}`
    );
  }

  const authorController = await getAuthorController();
  const author = await authorController.getByAuthorName(authorName);

  return {
    props: {
      authorName,
      author: serialize<Schema$Author>(author) || null
    }
  };
};

export function AuthorPage(props: ClientAuthorProps) {
  return (
    <>
      <Meta />
      <ClientAuthor {...props} />
    </>
  );
}

export default AuthorPage;

AuthorPage.layout = ClientLayout;
