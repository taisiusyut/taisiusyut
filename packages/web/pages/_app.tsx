import React, { useEffect } from 'react';
import Head from 'next/head';
import router from 'next/router';
import type { AppProps /*, AppContext */ } from 'next/app';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import '@/styles/globals.scss';
import 'typeface-muli';

interface ExtendAppProps extends AppProps {
  Component: AppProps['Component'] & { isPublic?: boolean };
}

function App({ Component, pageProps }: ExtendAppProps) {
  const [{ loginStatus, isAdmin }, actions] = useAuth();

  useEffect(() => {
    if (loginStatus === 'unknown') {
      actions.authenticate();
    }
    if (loginStatus === 'loggedIn' || loginStatus === 'required') {
      if (router.asPath.startsWith('/admin') && !isAdmin) {
        router.push('/');
      }
    }
  }, [loginStatus, isAdmin, actions]);

  if (Component.isPublic || loginStatus === 'loggedIn') {
    return <Component {...pageProps} />;
  }

  return null;
}

function Root(props: ExtendAppProps) {
  return (
    <AuthProvider>
      <Head>
        <title>睇小說</title>
      </Head>
      <App {...props} />
    </AuthProvider>
  );
}

export default Root;
