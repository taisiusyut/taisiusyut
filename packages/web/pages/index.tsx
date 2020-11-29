import React from 'react';
import { GetStaticProps } from 'next';
import { ClientLayout } from '@/components/client/ClientLayout';
import { ClientHome, ClientHomeProps } from '@/components/client/ClientHome';
import { getBookService, serializer } from '@/service/server';
import { Schema$Book, Order, BookStatus } from '@/typings';

interface Props extends Pick<ClientHomeProps, 'data'> {}

async function getClientHomePageData(): Promise<ClientHomeProps['data']> {
  const bookService = await getBookService();
  const limit = 6;
  const response = await Promise.all([
    bookService.random(limit),
    bookService.random(limit),
    bookService.random(limit),
    bookService.findAll({ status: BookStatus.Finished }, null, {
      sort: { updatedAt: Order.DESC },
      limit
    })
  ]);
  const [mostvisited, clientSuggested, adminSuggested, finished] = response.map(
    books =>
      books.map(
        doc =>
          serializer.transformToPlain(doc, {
            excludePrefixes: ['_']
          }) as Schema$Book
      )
  );

  return {
    mostvisited,
    adminSuggested,
    clientSuggested,
    finished
  };
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const data = await getClientHomePageData();
  return {
    props: {
      data
    }
  };
};

export default function HomePage({ data }: Props) {
  return <ClientHome data={data} />;
}

HomePage.layout = ClientLayout;
