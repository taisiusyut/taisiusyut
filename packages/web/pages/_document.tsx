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
        </body>
      </Html>
    );
  }
}

export default MyDocument;
