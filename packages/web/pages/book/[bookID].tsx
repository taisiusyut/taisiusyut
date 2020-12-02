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
import { PaginateResult, ChapterStatus, Schema$Book } from '@/typings';
import { Order, Schema$Chapter } from '@/../server/dist';

// TODO: handle private book/chatper

interface Props extends ClientBookDetailsProps {}

type Params = {
  bookID: string;
};

export const getServerSideProps: GetServerSideProps<
  Props,
  Params
> = async context => {
  const { bookID, ...query } = context.query;

  if (typeof bookID !== 'string') {
    throw new Error(`bookID is ${bookID}`);
  }

  const [bookController, chapterController] = await Promise.all([
    getBookController(context.res.app),
    getChpaterController(context.res.app)
  ]);

  const getBook = bookController
    .getBook(context.req as any, bookID)
    .then(book => book && serialize<Schema$Book>(book));

  const getChapters = chapterController
    .getChapters(context.req as any, bookID, {
      pageSize: 30,
      status: ChapterStatus.Public,
      sort: { createdAt: Order.ASC },
      ...query
    })
    .then(response => serialize<PaginateResult<Schema$Chapter>>(response));

  const [book, chapters] = await Promise.all([getBook, getChapters]);

  return {
    props: {
      bookID,
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
