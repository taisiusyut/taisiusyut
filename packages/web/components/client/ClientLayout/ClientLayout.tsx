import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/router';
import { BookShelfProvider } from '@/hooks/useBookShelf';
import { BreakPointsProvider } from '@/hooks/useBreakPoints';
import { ClientPreferencesProvider } from '@/hooks/useClientPreferences';
import { BookShelf } from '../BookShelf';
import classes from './ClientLayout.module.scss';
import { BottomNavigation } from '../BottomNavigation';

interface Props {
  children?: ReactNode;
}

const scrollRestoration: Record<string, number> = {};

function ClientLayoutContent({ children }: Props) {
  const router = useRouter();

  // scroll restoration for mobile view
  useEffect(() => {
    const routeChangeStart = () => {
      scrollRestoration[router.asPath] = window.scrollY;
    };
    const routeChangeComplete = (url: string) => {
      window.scrollTo(0, scrollRestoration[url] || 0);
    };
    router.events.on('routeChangeStart', routeChangeStart);
    router.events.on('routeChangeComplete', routeChangeComplete);
    return () => {
      router.events.off('routeChangeStart', routeChangeStart);
      router.events.off('routeChangeComplete', routeChangeComplete);
    };
  }, [router]);

  return (
    <div
      className={[
        classes['layout'],
        router.asPath === '/' ? classes['home'] : ''
      ]
        .join(' ')
        .trim()}
    >
      <div className={classes['layout-content']}>
        <div className={classes['left-panel']}>
          <BookShelf />
        </div>
        <div className={classes['right-panel']}>{children}</div>
      </div>
      <div className={classes['bottom-navigation']}>
        {['/', '/explore', '/search'].includes(router.asPath) && (
          <BottomNavigation />
        )}
      </div>
    </div>
  );
}

export function ClientLayout(props: Props) {
  return (
    <ClientPreferencesProvider>
      <BookShelfProvider>
        <BreakPointsProvider>
          <ClientLayoutContent {...props} />
        </BreakPointsProvider>
      </BookShelfProvider>
    </ClientPreferencesProvider>
  );
}
