import fs from 'fs';
import React from 'react';
import marked from 'marked';
import { GetStaticPaths, GetStaticProps } from 'next';
import { ClientHeader, ClientLayout } from '@/components/client/ClientLayout';
import { GoBackButton } from '@/components/GoBackButton';

interface Props {
  html: string;
}

const revalidate = 60 * 60;

export const getStaticProps: GetStaticProps<Props> = async () => {
  const content = fs.readFileSync(`tnc.md`, 'utf-8');
  const html = marked(content, { gfm: true });

  return {
    revalidate,
    props: {
      html
    }
  };
};

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: [],
  fallback: false
});

export default function TNCPage({ html }: Props) {
  return (
    <>
      <ClientHeader title="條款及細則" left={<GoBackButton />} />
      <div dangerouslySetInnerHTML={{ __html: html }}></div>
    </>
  );
}

TNCPage.layout = ClientLayout;
