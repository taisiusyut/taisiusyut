import React from 'react';
import { GetServerSideProps } from 'next';
import { Meta } from '@/components/Meta';
import { ClientLayout } from '@/components/client/ClientLayout';
import {
  ClientBookChapter,
  ClientBookChapterData
} from '@/components/client/ClientBookChapter';
import {
  getBookController,
  getChpaterController,
  serialize
} from '@/service/server';
import { Schema$Book, Schema$Chapter } from '@/typings';

interface Props extends ClientBookChapterData {}

type Params = {
  bookName: string;
  chapterNo: string;
};

export const getServerSideProps: GetServerSideProps<
  Props,
  Params
> = async context => {
  const { bookName, chapterNo } = context.query;

  if (typeof bookName !== 'string') {
    throw new Error(`bookName is ${bookName}`);
  }

  if (typeof chapterNo !== 'string') {
    throw new Error(`chapterName is ${chapterNo}`);
  }

  const [bookController, chapterController] = await Promise.all([
    getBookController(context.res.app),
    getChpaterController(context.res.app)
  ]);

  const book = await bookController
    .getBookByName(context.req as any, bookName)
    .then(book => serialize<Schema$Book | null>(book));

  const chapter = book
    ? await chapterController
        .getChapterbyNo(context.req as any, book.id, Number(chapterNo))
        .then(chapter => serialize<Schema$Chapter | null>(chapter))
    : null;

  return {
    props: { bookName, chapterNo: Number(chapterNo), chapter }
  };
};

export default function ClientBookChapterPage(props: Props) {
  const { bookName, chapter } = props;
  let head: React.ReactNode = null;

  if (chapter) {
    head = (
      <Meta
        title={`${chapter.name} | ${bookName} | 睇小說`}
        keywords={bookName}
        description={chapter.content.trim().slice(0, 100)}
      />
    );
  }

  return (
    <>
      {head}
      <ClientBookChapter {...props} />
    </>
  );
}

ClientBookChapterPage.layout = ClientLayout;
