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
    const { asPath } = router;

    if (loginStatus === 'unknown') {
      actions.authenticate();
    }

    if (asPath.startsWith('/admin') && !isAdmin) {
      if (loginStatus === 'loggedIn') {
        router.push('/', { query: { from: asPath } });
      }

      if (loginStatus === 'required') {
        const pathname = '/admin/login';
        if (asPath !== pathname)
          router.push({ pathname, query: { from: asPath } }, pathname);
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
