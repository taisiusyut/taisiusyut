import React from 'react';
import type { AppProps /*, AppContext */ } from 'next/app';
import 'typeface-muli';
import '@/styles/globals.scss';

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
