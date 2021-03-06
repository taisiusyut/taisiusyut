import React from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import { Meta } from '@/components/Meta';
import {
  ClientLayout,
  ClientLayoutProps
} from '@/components/client/ClientLayout';
import {
  chapterDocumentTitle,
  ClientChapter,
  ClientChapterData,
  ClientChapterParams
} from '@/components/client/ClientChapter';
import {
  getBookController,
  getChpaterController,
  serialize
} from '@/service/server';
import { Schema$Book, Schema$Chapter } from '@/typings';
import { removeTags } from '@/utils/chapterContent';

interface Props extends ClientChapterData {}

type Params = {
  [X in keyof ClientChapterParams]: string;
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking'
  };
};

export const getStaticProps: GetStaticProps<Props, Params> = async context => {
  const { bookName, chapterNo } = context.params || {};

  if (typeof bookName !== 'string') {
    throw new Error(`bookName is ${bookName}`);
  }

  if (typeof chapterNo !== 'string') {
    throw new Error(`chapterName is ${chapterNo}`);
  }

  const [bookController, chapterController] = await Promise.all([
    getBookController(),
    getChpaterController()
  ]);

  const book = await bookController
    .getByName({} as any, bookName)
    .then(book => serialize<Schema$Book | null>(book))
    .catch(() => null);

  const chapter = book
    ? await chapterController
        .getByNum({} as any, book.id, Number(chapterNo))
        .then(chapter => serialize<Schema$Chapter | null>(chapter))
        .catch(() => null)
    : null;

  return {
    revalidate: 60 * 60,
    props: {
      bookID: book?.id || null,
      bookName,
      chapterNo: Number(chapterNo),
      chapter
    }
  };
};

export default function ClientChapterPage(props: Props) {
  const { bookName, chapter } = props;

  const head = chapter ? (
    <Meta
      keywords={bookName}
      title={chapterDocumentTitle(chapter.number, bookName, chapter?.prefix)}
      description={removeTags(chapter.content)
        .trim()
        .replace(/\n/g, '')
        .slice(0, 100)}
    />
  ) : null;

  return (
    <>
      {head}
      <ClientChapter {...props} key={bookName} />
    </>
  );
}

const layoutProps: ClientLayoutProps = {
  disableScrollRestoration: true
};

ClientChapterPage.layout = ClientLayout;
ClientChapterPage.layoutProps = layoutProps;
