import React from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import { ClientLayout } from '@/components/client/ClientLayout';
import {
  ClientAuthor,
  ClientAuthorProps,
  ClientAuthorParams
} from '@/components/client/ClientAuthor';
import { Meta } from '@/components/Meta';
import { getAuthorController, serialize } from '@/service/server';
import { Schema$Author } from '@/typings';

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking'
  };
};

export const getStaticProps: GetStaticProps<
  ClientAuthorProps,
  ClientAuthorParams
> = async context => {
  const { authorName } = context.params || {};

  if (typeof authorName !== 'string') {
    throw new Error(
      `expect authorName to be string but received ${authorName}`
    );
  }

  const authorController = await getAuthorController();
  const author = await authorController.getByAuthorName(authorName);

  return {
    revalidate: 60 * 60,
    props: {
      authorName,
      author: serialize<Schema$Author>(author) || null
    }
  };
};

export function AuthorPage(props: ClientAuthorProps) {
  return (
    <>
      <Meta title={`${props.authorName} | 睇小說`} />
      <ClientAuthor {...props} />
    </>
  );
}

export default AuthorPage;

AuthorPage.layout = ClientLayout;
