import React from 'react';
import Document, {
  DocumentContext,
  Html,
  Head,
  Main,
  NextScript
} from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return initialProps;
  }

  render() {
    return (
      <Html data-theme="light">
        <Head>
          <link rel="icon" type="image/x-icon" href="/favicon.ico" />
          <link rel="preload" href="/preload.js" as="script" />
        </Head>
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
