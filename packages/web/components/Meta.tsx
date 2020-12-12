import { ReactNode } from 'react';
import Head from 'next/head';

interface Props {
  title?: string;
  keywords?: string;
  description?: string;
  children?: ReactNode;
}

const ORIGIN = process.env.ORIGIN || 'http://localhost:3000';

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

        <meta
          name="viewport"
          content="initial-scale=1.0, maximum-scale=1.0, shrink-to-fit=no, user-scalable=no, width=device-width, viewport-fit=cover"
        />

        <meta key="robots" name="robots" content="all" />
        <meta key="googlebot" name="googlebot" content="all" />
        <meta key="keywords" name="keywords" content={keywords} />
        <meta key="description" name="description" content={description} />

        <meta name="application-name" content="睇小說" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="睇小說" />
        <meta name="description" content={description} />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />

        <meta name="msapplication-config" content="/icons/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#000000" />

        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/icons/apple-touch-icon.png"
        />
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

        <meta property="og:type" content="website" />
        <meta property="og:title" content="睇小說" />
        <meta property="og:description" content={description} />
        <meta property="og:site_name" content="睇小說" />
        <meta property="og:url" content={ORIGIN} />
        <meta
          property="og:image"
          content={`${ORIGIN}/icons/apple-touch-icon.png`}
        />
        {children}
      </Head>
    </>
  );
}
