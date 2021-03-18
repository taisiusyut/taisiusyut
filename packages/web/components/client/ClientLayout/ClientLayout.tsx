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

function getState(asPath: string, pagingDisplay: boolean) {
  const isHome = isPathEqual('/', asPath);
  const isSearch = isPathMatch('/search', asPath);
  const isFeatured = isPathEqual('/featured', asPath);
  const mountBottomNav = isHome || isFeatured || isSearch;
  const showOtherLeftPanel = shouldShowLeftPanel(asPath, pagingDisplay);
  const showBookShelf = pagingDisplay ? !showOtherLeftPanel : isHome;
  const showRightPanel = pagingDisplay ? true : !isHome && !showOtherLeftPanel;

  return {
    isSearch,
    mountBottomNav,
    showOtherLeftPanel,
    showBookShelf,
    showRightPanel
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

  const [state, setState] = useState(() => {
    const state = getState(asPath, pagingDisplay);
    return { ...state, isSearching: state.isSearch };
  });
  const { showRightPanel, mountBottomNav, isSearching } = state;
  const showBookShelf = state.showBookShelf && !isSearching;
  const showOtherLeftPanel = state.showOtherLeftPanel || isSearching;

  const [leaveOtherContent] = useState(() => () =>
    goBack({ targetPath: ['/', '/featured'] }).then(() =>
      setState(state => ({ ...state, isSearching: false }))
    )
  );

  // scroll restoration for single page display
  useScrollRestoration(disableScrollRestoration);

  useEffect(() => {
    const handler = (pathname: string) => {
      const largeScreen = window.innerWidth > breakPoint;
      const newState = getState(pathname, pagingDisplay && largeScreen);
      setState(state => ({
        ...newState,
        isSearching: largeScreen
          ? state.isSearching || newState.showOtherLeftPanel
          : state.isSearching
      }));
    };
    const resize = () => handler(router.asPath);

    window.addEventListener('resize', resize);
    events.on('routeChangeComplete', handler);

    handler(router.asPath);
    return () => {
      events.off('routeChangeComplete', handler);
      window.removeEventListener('resize', resize);
    };
  }, [events, pagingDisplay]);

  return (
    <div className={[classes['layout']].join(' ').trim()}>
      <div className={classes['layout-content']}>
        {/* should not unmount the left panel component. 
            because the first-time rendering and scroll position restoration will not smooth */}
        <div
          className={classes['left-panel']}
          hidden={!showBookShelf || isSearching}
        >
          <BookShelf />
        </div>
        <div className={classes['left-panel']} hidden={!showOtherLeftPanel}>
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
