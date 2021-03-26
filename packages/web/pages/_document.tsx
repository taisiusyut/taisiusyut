import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';
import { Meta } from '@/components/Meta';
import { InlineScript } from '@/components/InlineScript';
import { preload } from 'preload';

class MyDocument extends Document {
  render() {
    return (
      <Html
        lang="zh-hk"
        className="bp3-dark"
        data-theme="dark"
        data-width="fixed"
        data-display="paging"
      >
        <Head>
          <InlineScript fn={preload} />
          <link rel="preconnect" href="https://www.google-analytics.com" />
          <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        </Head>
        <Meta />
        <body>
          <noscript
            dangerouslySetInnerHTML={{
              __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GTM_ID}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`
            }}
          />
          <Main />
          <NextScript />
          <InlineScript
            fn={`
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer', '${process.env.NEXT_PUBLIC_GTM_ID}');
            `}
          />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
