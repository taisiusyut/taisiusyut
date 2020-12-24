import { useEffect } from 'react';
import router from 'next/router';
import { GTMPageView } from './gtm';
import { useAuthState } from '../useAuth';

export function usePageView() {
  const { user } = useAuthState();

  useEffect(() => {
    const handler = (url: string) => {
      GTMPageView(url, user?.user_id);
    };
    router.events.on('routeChangeComplete', handler);
    return () => {
      router.events.off('routeChangeComplete', handler);
    };
  }, [user]);
}
