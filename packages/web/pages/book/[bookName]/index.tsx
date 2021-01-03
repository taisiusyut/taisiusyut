import React from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import { Meta } from '@/components/Meta';
import { ClientLayout } from '@/components/client/ClientLayout';
import {
  ClientBookDetails,
  ClientBookDetailsProps
} from '@/components/client/ClientBookDetails';
import {
  getBookController,
  getChpaterController,
  serialize
} from '@/service/server';
import {
  Order,
  PaginateResult,
  ChapterStatus,
  Schema$Chapter,
  Schema$Book
} from '@/typings';

// TODO: handle private book/chatper

interface Props extends ClientBookDetailsProps {}

type Params = {
  bookName: string;
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: true
  };
};

export const getStaticProps: GetStaticProps<Props, Params> = async context => {
  const { bookName, ...query } = context.params || {};

  if (typeof bookName !== 'string') {
    throw new Error(`bookName is ${bookName}`);
  }

  const [bookController, chapterController] = await Promise.all([
    getBookController(),
    getChpaterController()
  ]);

  const book = await bookController
    .getByName({} as any, bookName)
    .then(book => book && serialize<Schema$Book | null>(book));

  const chapters = book
    ? await chapterController
        .getAll({} as any, book.id, {
          pageSize: 30,
          status: ChapterStatus.Public,
          sort: { createdAt: Order.ASC },
          ...query
        })
        .then(response => serialize<PaginateResult<Schema$Chapter>>(response))
    : undefined;

  return {
    revalidate: 60 * 60,
    props: {
      book,
      bookName,
      chapters
    }
  };
};

export default function ClientBookDetailsPage(props: Props) {
  const { book } = props;
  let head: React.ReactNode = null;

  if (book) {
    head = (
      <Meta
        title={`${book.name} | ${book.authorName} | 睇小說`}
        keywords={book.name}
        description={book.description}
      />
    );
  }

  return (
    <>
      {head}
      <ClientBookDetails {...props} />
    </>
  );
}

ClientBookDetailsPage.layout = ClientLayout;
