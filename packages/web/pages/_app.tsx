import React, { ReactNode, useEffect } from 'react';
import Head from 'next/head';
import router from 'next/router';
import type { AppProps /*, AppContext */ } from 'next/app';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/typings';
import '@/styles/globals.scss';
import 'typeface-muli';

interface ExtendAppProps extends AppProps {
  Component: AppProps['Component'] & {
    access?: UserRole[];
    redirect?: string;
    layout?: React.ComponentType<{ children?: ReactNode }>;
  };
}

function Redirect({ redirect }: { redirect?: string }) {
  useEffect(() => {
    const pathname =
      redirect || (router.asPath.startsWith(`/admin`) ? '/admin/login' : '/');
    const url = { pathname, query: { from: router.asPath } };
    router.push(url, pathname);
  }, [redirect]);
  return <div hidden />;
}

function AppContent({ Component, pageProps }: ExtendAppProps) {
  const [{ loginStatus, user }, actions] = useAuth();

  useEffect(() => {
    actions.authenticate();
  }, [actions]);

  if (!Component.access || (user && Component.access.includes(user.role))) {
    const Layout = Component.layout || React.Fragment;
    return (
      <Layout>
        <Component {...pageProps} />
      </Layout>
    );
  }

  if (loginStatus === 'unknown' || loginStatus === 'loading') {
    return null;
  }

  return <Redirect redirect={Component.redirect} />;
}

function App(props: ExtendAppProps) {
  return (
    <AuthProvider>
      <Head>
        <title>睇小說</title>
      </Head>
      <AppContent {...props} />
    </AuthProvider>
  );
}

export default App;