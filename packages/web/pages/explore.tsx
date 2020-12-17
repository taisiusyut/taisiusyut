import React from 'react';
import { GetStaticProps } from 'next';
import { ClientLayout } from '@/components/client/ClientLayout';
import { Explore, ExploreProps } from '@/components/client/Explore';
import { Meta } from '@/components/Meta';
import { getBookService, serialize } from '@/service/server';
import { Schema$Book, Order, BookStatus } from '@/typings';

interface Props extends Pick<ExploreProps, 'data'> {}

async function getClientExplorePageData(): Promise<ExploreProps['data']> {
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
    books => {
      return books.map(doc => serialize<Schema$Book>(doc));
    }
  );

  return {
    mostvisited,
    adminSuggested,
    clientSuggested,
    finished
  };
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const data = await getClientExplorePageData();
  return {
    revalidate: 60 * 60,
    props: {
      data
    }
  };
};

export function ExplorePage({ data }: Props) {
  return (
    <>
      <Meta />
      <Explore data={data} />
    </>
  );
}

export default ExplorePage;

ExplorePage.layout = ClientLayout;
