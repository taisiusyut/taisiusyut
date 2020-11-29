import React from 'react';
import { GetServerSideProps } from 'next';
import { ClientLayout } from '@/components/client/ClientLayout';
import {
  ClientBookDetails,
  ClientBookDetailsProps
} from '@/components/client/ClientBookDetails';
import {
  getBookService,
  getChpaterService,
  serializer
} from '@/service/server';
import {
  PaginateResult,
  BookStatus,
  ChapterStatus,
  Schema$Book
} from '@/typings';
import { Order, Schema$Chapter } from '@/../server/dist';

// TODO: handle private book/chatper

interface Props extends ClientBookDetailsProps {}

async function getData(bookID: string): Promise<ClientBookDetailsProps> {
  const [bookService, chpaterService] = await Promise.all([
    getBookService(),
    getChpaterService()
  ]);

  const getBook = bookService
    .findOne({
      _id: bookID,
      $or: [{ status: BookStatus.Public }, { status: BookStatus.Finished }]
    })
    .then(
      book =>
        book &&
        (serializer.transformToPlain(book, {
          excludePrefixes: ['_']
        }) as Schema$Book)
    );

  const getChapters = chpaterService
    .paginate(
      {
        book: bookID,
        pageSize: 20,
        status: ChapterStatus.Public,
        sort: { createdAt: Order.ASC }
      },
      {
        projection: {
          content: 0,
          createdAt: 0,
          updatedAt: 0
        }
      }
    )
    .then(
      response =>
        ({
          ...response,
          data: response.data.map(chapter =>
            serializer.transformToPlain(chapter, {
              excludePrefixes: ['_']
            })
          )
        } as PaginateResult<Schema$Chapter>)
    );

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
    props: await getData(bookID)
  };
};

export default function ClientBookDetailsPage(props: Props) {
  return <ClientBookDetails {...props} />;
}

ClientBookDetailsPage.layout = ClientLayout;
