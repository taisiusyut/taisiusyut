import React from 'react';
import { GetServerSideProps } from 'next';
import { IncomingMessage } from 'http';
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

async function getData(
  req: IncomingMessage,
  bookID: string
): Promise<ClientBookDetailsProps> {
  const [bookController, chapterController] = await Promise.all([
    getBookController(),
    getChpaterController()
  ]);

  const getBook = bookController
    .getBook(req as any, bookID)
    .then(book => book && serialize<Schema$Book>(book));

  const getChapters = chapterController
    .getChapters(req as any, bookID, {
      pageSize: 20,
      status: ChapterStatus.Public,
      sort: { createdAt: Order.ASC }
    })
    .then(response => serialize<PaginateResult<Schema$Chapter>>(response));

  const [book, chapters] = await Promise.all([getBook, getChapters]);

  return {
    bookID,
    book,
    chapters
  };
}

export const getServerSideProps: GetServerSideProps<Props> = async context => {
  const { bookID } = context.query;

  if (typeof bookID !== 'string') {
    throw new Error(`bookID is ${bookID}`);
  }

  return {
    props: await getData(context.req, bookID)
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
