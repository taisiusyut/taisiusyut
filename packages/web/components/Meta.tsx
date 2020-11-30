import { ReactNode } from 'react';
import Head from 'next/head';

interface Props {
  title?: string;
  keywords?: string;
  description?: string;
  children?: ReactNode;
}

export function Meta({
  children,
  title = '睇小說',
  keywords = '睇小說',
  description = '睇小說'
}: Props) {
  return (
    <>
      <Head>
        <title key="title">{title}</title>
        <meta key="robots" name="robots" content="all" />
        <meta key="googlebot" name="googlebot" content="all" />
        <meta key="keywords" name="keywords" content={keywords} />
        <meta key="description" name="description" content={description} />
        {children}
      </Head>
    </>
  );
}
