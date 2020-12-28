import { useEffect } from 'react';
import router from 'next/router';
import { GTMPageView } from './gtm';
import { useAuthState } from '../useAuth';

export function usePageView() {
  const { loginStatus } = useAuthState();

  useEffect(() => {
    if (loginStatus === 'loggedIn' || loginStatus === 'required') {
      const handler = (url: string) => {
        GTMPageView(url);
      };
      router.events.on('routeChangeComplete', handler);
      return () => {
        router.events.off('routeChangeComplete', handler);
      };
    }
  }, [loginStatus]);
}
