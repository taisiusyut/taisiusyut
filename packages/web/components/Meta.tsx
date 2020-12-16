import { ReactNode } from 'react';
import Head from 'next/head';

interface Props {
  title?: string;
  keywords?: string;
  description?: string;
  robots?: string;
  children?: ReactNode;
}

const ORIGIN = process.env.NEXT_PUBLIC_ORIGIN || '';

export function Meta({
  children,
  title = '睇小說',
  keywords = '睇小說',
  description = '睇小說',
  robots = 'all'
}: Props) {
  return (
    <Head>
      <title key="title">{title}</title>

      <meta key="robots" name="robots" content={robots} />
      <meta key="googlebot" name="googlebot" content={robots} />
      <meta key="keywords" name="keywords" content={keywords} />
      <meta key="description" name="description" content={description} />

      <meta key="og:type" property="og:type" content="website" />
      <meta key="og:title" property="og:title" content={title} />
      <meta
        key="og:description"
        property="og:description"
        content={description}
      />
      <meta key="og:site_name" property="og:site_name" content="睇小說" />
      <meta key="og:url" property="og:url" content={ORIGIN} />
      <meta
        key="og:image"
        property="og:image"
        content={`${ORIGIN}/icons/apple-touch-icon.png`}
      />
      {children}
    </Head>
  );
}

export function CommonMeta() {
  return (
    <>
      <Meta />
      <Head>
        <meta
          name="viewport"
          content="initial-scale=1.0, maximum-scale=5.0, shrink-to-fit=no, user-scalable=yes, width=device-width, viewport-fit=cover"
        />

        <meta name="google" content="notranslate" />

        <meta name="application-name" content="睇小說" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="睇小說" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />

        <meta name="msapplication-config" content="/icons/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#000000" />

        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/icons/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/icons/favicon-16x16.png"
        />

        <link rel="manifest" href="/manifest.json" />
        {/* https://developer.yoast.com/blog/safari-pinned-tab-icon-mask-icon/ */}
        <link rel="mask-icon" href="/icon.svg" color="#ffffff" />
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>
    </>
  );
}
