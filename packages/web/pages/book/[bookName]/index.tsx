import React from 'react';
import { GetServerSideProps } from 'next';
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

export const getServerSideProps: GetServerSideProps<
  Props,
  Params
> = async context => {
  const { bookName, ...query } = context.query;

  if (typeof bookName !== 'string') {
    throw new Error(`bookName is ${bookName}`);
  }

  const [bookController, chapterController] = await Promise.all([
    getBookController(context.res.app),
    getChpaterController(context.res.app)
  ]);

  const book = await bookController
    .getBookByName(context.req as any, bookName)
    .then(book => book && serialize<Schema$Book | null>(book));

  const chapters = book
    ? await chapterController
        .getChapters(context.req as any, book.id, {
          pageSize: 30,
          status: ChapterStatus.Public,
          sort: { createdAt: Order.ASC },
          ...query
        })
        .then(response => serialize<PaginateResult<Schema$Chapter>>(response))
    : undefined;

  return {
    props: {
      bookName,
      book,
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
        title={`${book.name} | ${book.author.nickname} | 睇小說`}
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
