import React from 'react';
import Document, {
  DocumentContext,
  Html,
  Head,
  Main,
  NextScript
} from 'next/document';
import { Meta } from '@/components/Meta';

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return initialProps;
  }

  render() {
    return (
      <Html lang="zh-hk">
        <Head>
          <link rel="preload" href="/preload.js" as="script" />
        </Head>
        <Meta />
        <body>
          <script src="/preload.js" />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
