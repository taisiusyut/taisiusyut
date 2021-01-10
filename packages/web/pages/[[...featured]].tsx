import React from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import { ClientLayout } from '@/components/client/ClientLayout';
import { Featured, FeaturedProps } from '@/components/client/Featured';
import { Meta } from '@/components/Meta';
import {
  getClientFeaturedPageData,
  clearFeaturedData
} from '@/service/featured';

interface Props extends Pick<FeaturedProps, 'data'> {}

const revalidate = 60 * 60;

export const getStaticProps: GetStaticProps<Props> = async context => {
  const result = await getClientFeaturedPageData();

  if (new Date().getTime() > result.updatedAt + revalidate * 1000) {
    clearFeaturedData();
    return getStaticProps(context);
  }

  return {
    revalidate,
    props: {
      data: result.data
    }
  };
};

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: ['/', '/featured'],
  fallback: false
});

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
