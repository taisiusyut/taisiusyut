import { ReactNode, useEffect, useState } from 'react';
import router, { useRouter } from 'next/router';
import { useGoBack } from '@/hooks/useGoBack';
import { BookShelfProvider } from '@/hooks/useBookShelf';
import { BreakPointsProvider } from '@/hooks/useBreakPoints';
import { useScrollRestoration } from '@/hooks/useScrollRestoration';
import {
  ClientPreferencesProvider,
  useClientPreferencesState
} from '@/hooks/useClientPreferences';
import { BookShelf } from '../BookShelf';
import { BottomNavigation } from '../BottomNavigation';
import { OtherContent } from './OtherContent';
import classes from './ClientLayout.module.scss';

export interface ClientLayoutProps {
  children?: ReactNode;
  disableScrollRestoration?: boolean;
}

function isPathEqual(pathname: string, asPath: string) {
  return pathname === asPath.replace(/\?.*/, '');
}

function isPathMatch(pathname: string, asPath: string) {
  return asPath.startsWith(`${pathname}`);
}

function shouldShowLeftPanel(asPath: string, pagingDisplay: boolean) {
  return ['/search', '/reports'].some(pathname =>
    pagingDisplay
      ? isPathMatch(pathname, asPath)
      : isPathEqual(pathname, asPath)
  );
}

function getState(
  asPath: string,
  usePagingDisplay: boolean,
  isSearching?: boolean
) {
  const isHome = isPathEqual('/', asPath);
  const isSearch = isPathMatch('/search', asPath);
  const isFeatured = isPathEqual('/featured', asPath);
  const mountBottomNav = isHome || isFeatured || isSearch;

  const common = {
    isSearch,
    mountBottomNav
  };

  if (usePagingDisplay) {
    const showBookShelf =
      !shouldShowLeftPanel(asPath, usePagingDisplay) && !isSearching;
    return {
      ...common,
      showLeftPanel: true,
      showRightPanel: true,
      showBookShelf
    };
  }
  const showLeftPanel = isHome || shouldShowLeftPanel(asPath, usePagingDisplay);
  return {
    ...common,
    showLeftPanel,
    showRightPanel: !showLeftPanel,
    showBookShelf: isHome
  };
}

const breakPoint = 768;

function ClientLayoutContent({
  children,
  disableScrollRestoration = false
}: ClientLayoutProps) {
  const { asPath, events } = useRouter();
  const { goBack } = useGoBack();
  const { pagingDisplay } = useClientPreferencesState();

  const [
    { isSearch, showLeftPanel, showBookShelf, showRightPanel, mountBottomNav },
    setState
  ] = useState(getState(asPath, pagingDisplay));
  const [isSearching, setIsSearching] = useState(isSearch);

  const [leaveOtherContent] = useState(() => () =>
    goBack({ targetPath: ['/', '/featured'] }).then(() => setIsSearching(false))
  );

  // scroll restoration for single page display
  useScrollRestoration(disableScrollRestoration);

  useEffect(() => {
    const handler = (pathname: string) => {
      const usePagingDisplay = pagingDisplay && window.innerWidth > breakPoint;
      const newState = getState(pathname, usePagingDisplay, isSearching);
      setState(newState);
      setIsSearching(isSearching =>
        usePagingDisplay ? isSearching || newState.isSearch : isSearching
      );
    };
    const resize = () => handler(router.asPath);

    window.addEventListener('resize', resize);
    events.on('routeChangeComplete', handler);

    handler(router.asPath);
    return () => {
      events.off('routeChangeComplete', handler);
      window.removeEventListener('resize', resize);
    };
  }, [events, pagingDisplay, isSearching]);

  return (
    <div className={[classes['layout']].join(' ').trim()}>
      <div className={classes['layout-content']}>
        {/* should not unmount the left panel component. 
            because the first-time rendering and scroll position restoration will not smooth */}
        <div
          className={classes['left-panel']}
          hidden={!showLeftPanel || !showBookShelf}
        >
          <BookShelf />
        </div>
        <div
          className={classes['left-panel']}
          hidden={!showLeftPanel || showBookShelf}
        >
          <OtherContent
            asPath={asPath}
            isSearching={isSearching}
            onLeave={leaveOtherContent}
          />
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

export function ClientLayout(props: ClientLayoutProps) {
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
