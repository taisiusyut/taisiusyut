import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useGoBack } from '@/hooks/useGoBack';
import { BookShelfProvider } from '@/hooks/useBookShelf';
import { BreakPointsProvider } from '@/hooks/useBreakPoints';
import {
  ClientPreferencesProvider,
  useClientPreferencesState
} from '@/hooks/useClientPreferences';
import { BookShelf } from '../BookShelf';
import { ClientSearch } from '../ClientSearch';
import { BottomNavigation } from '../BottomNavigation';
import classes from './ClientLayout.module.scss';

interface Props {
  children?: ReactNode;
}

const scrollRestoration: Record<string, number> = {};

const breakPoint = 768;

function ClientLayoutContent({ children }: Props) {
  const { asPath, events } = useRouter();
  const { pagingDisplay } = useClientPreferencesState();
  const { goBack } = useGoBack();

  const [isSearching, setIsSearching] = useState(asPath.startsWith('/search'));

  const isHome = /^\/(\?.*)?$/.test(asPath);
  const isFeatured = /^\/featured(\?.*)?$/.test(asPath);
  const isSearch = asPath.startsWith('/search');

  const hideBookShelf = (!pagingDisplay && !isHome) || isSearching;
  const hideSearchPanel = (!pagingDisplay && !isSearch) || !isSearching;
  const showRightPanel = pagingDisplay || (!isHome && !isSearch);
  const mountBottomNav = isHome || isFeatured || isSearch;

  const leaveSearchPanel = () =>
    goBack({ targetPath: ['/', '/featured'] }).then(() =>
      setIsSearching(false)
    );

  // scroll restoration for single page display
  useEffect(() => {
    // check shallow for `ClientBookChapter.tsx`
    const routeChangeStart = (_url: string, options: { shallow?: boolean }) => {
      if (!options.shallow) {
        scrollRestoration[asPath] = window.scrollY;
      }
    };
    const routeChangeComplete = (
      url: string,
      options: { shallow?: boolean }
    ) => {
      if (!options.shallow) {
        window.scrollTo(0, scrollRestoration[url] || 0);
      }
    };
    events.on('routeChangeStart', routeChangeStart);
    events.on('routeChangeComplete', routeChangeComplete);
    return () => {
      events.off('routeChangeStart', routeChangeStart);
      events.off('routeChangeComplete', routeChangeComplete);
    };
  }, [asPath, events]);

  useEffect(
    () =>
      setIsSearching(isSearching =>
        window.innerWidth > breakPoint ? isSearching || isSearch : isSearch
      ),
    [asPath, isSearch]
  );

  return (
    <div
      className={[
        classes['layout'],
        isHome || isSearch ? classes['show-left-panel'] : ''
      ]
        .join(' ')
        .trim()}
    >
      <div className={classes['layout-content']}>
        {/* should not unmount the left panel component. 
            because the first-time rendering and scroll position restoration will not smooth */}
        <div className={classes['left-panel']} hidden={hideBookShelf}>
          <BookShelf />
        </div>
        <div className={classes['left-panel']} hidden={hideSearchPanel}>
          <ClientSearch onLeave={leaveSearchPanel} />
        </div>
        {showRightPanel && (
          <div className={classes['right-panel']}>{children}</div>
        )}
      </div>
      <div className={classes['bottom-navigation']}>
        {mountBottomNav && <BottomNavigation />}
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
