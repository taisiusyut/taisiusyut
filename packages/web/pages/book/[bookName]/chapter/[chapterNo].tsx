import React from 'react';
import { GetServerSideProps } from 'next';
import { Meta } from '@/components/Meta';
import {
  ClientLayout,
  ClientLayoutProps
} from '@/components/client/ClientLayout';
import {
  getChapterTitle,
  ClientChapter,
  ClientChapterData
} from '@/components/client/ClientChapter';
import {
  getBookController,
  getChpaterController,
  serialize
} from '@/service/server';
import { Schema$Book, Schema$Chapter } from '@/typings';

interface Props extends ClientChapterData {}

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
    .getByName(context.req as any, bookName)
    .then(book => serialize<Schema$Book | null>(book));

  const chapter = book
    ? await chapterController
        .getByNum(context.req as any, book.id, Number(chapterNo))
        .then(chapter => serialize<Schema$Chapter | null>(chapter))
    : null;

  return {
    props: { bookID: book?.id, bookName, chapterNo: Number(chapterNo), chapter }
  };
};

export default function ClientChapterPage(props: Props) {
  const { bookName, chapter } = props;
  let head: React.ReactNode = null;

  if (chapter) {
    head = (
      <Meta
        keywords={bookName}
        title={getChapterTitle(chapter.name, bookName)}
        description={chapter.content.trim().slice(0, 100)}
      />
    );
  }

  return (
    <>
      {head}
      <ClientChapter {...props} key={bookName} />
    </>
  );
}

ClientChapterPage.layout = ClientLayout;
ClientChapterPage.layoutProps = {
  disableScrollRestoration: true
} as ClientLayoutProps;
