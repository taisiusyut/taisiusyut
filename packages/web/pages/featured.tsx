import React from 'react';
import { GetStaticProps } from 'next';
import { ClientLayout } from '@/components/client/ClientLayout';
import { Featured, FeaturedProps } from '@/components/client/Featured';
import { Meta } from '@/components/Meta';
import { getBookService, serialize } from '@/service/server';
import { Schema$Book, Order, BookStatus } from '@/typings';

interface Props extends Pick<FeaturedProps, 'data'> {}

async function getClientFeaturedPageData(): Promise<FeaturedProps['data']> {
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
  const data = await getClientFeaturedPageData();
  return {
    revalidate: 60 * 60,
    props: {
      data
    }
  };
};

export function FeaturedPage({ data }: Props) {
  return (
    <>
      <Meta />
      <Featured data={data} />
    </>
  );
}

export default FeaturedPage;

FeaturedPage.layout = ClientLayout;
