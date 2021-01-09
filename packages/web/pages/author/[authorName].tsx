import React from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import { ClientLayout } from '@/components/client/ClientLayout';
import {
  ClientAuthor,
  ClientAuthorProps,
  ClientAuthorParams
} from '@/components/client/ClientAuthor';
import { Meta } from '@/components/Meta';
import {
  getAuthorController,
  getBookController,
  serialize
} from '@/service/server';
import { Schema$Author, Schema$Book } from '@/typings';

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

  const [authorController, bookController] = await Promise.all([
    getAuthorController(),
    getBookController()
  ]);
  const author = await authorController
    .getByAuthorName(authorName)
    .then(author => serialize<Schema$Author>(author) || null)
    .catch(() => null);
  const books = await bookController
    .getAll({} as any, { authorName })
    .then(response => serialize<Schema$Book[] | null>(response.data))
    .catch(() => null);

  return {
    revalidate: 60 * 60,
    props: {
      authorName,
      author,
      books
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
