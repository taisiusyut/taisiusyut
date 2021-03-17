import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
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
import { OtherContent, shouldShowOtherContent } from './OtherContent';
import classes from './ClientLayout.module.scss';

export interface ClientLayoutProps {
  children?: ReactNode;
  disableScrollRestoration?: boolean;
}

function getState(asPath: string) {
  const isSearch = asPath.startsWith('/search');
  const isHome = /^\/(\?.*)?$/.test(asPath);
  const isFeatured = /^\/featured(\?.*)?$/.test(asPath);
  const mountBottomNav = isHome || isFeatured || isSearch;
  return {
    isHome,
    isFeatured,
    isSearch,
    mountBottomNav,
    isOtherContent: shouldShowOtherContent(asPath)
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
    { isHome, isSearching, isOtherContent, mountBottomNav },
    setState
  ] = useState(() => {
    const state = getState(asPath);
    return { ...state, isSearching: state.isSearch };
  });

  const showOtherContent = isOtherContent || isSearching;
  const showRightPanel = pagingDisplay || !(isHome && isSearching);
  const hideBookShelf = pagingDisplay ? showOtherContent : isHome;

  const [leaveOtherContent] = useState(() => () =>
    goBack({ targetPath: ['/', '/featured'] }).then(() =>
      setState(state => ({ ...state, isSearching: false }))
    )
  );

  // scroll restoration for single page display
  useScrollRestoration(disableScrollRestoration);

  useEffect(() => {
    const handler = (pathname: string) => {
      const newState = getState(pathname);
      setState(state => ({
        ...getState(pathname),
        isSearching:
          window.innerWidth > breakPoint
            ? state.isSearching || newState.isOtherContent
            : state.isSearching
      }));
    };
    events.on('routeChangeComplete', handler);
    return () => events.off('routeChangeComplete', handler);
  }, [events]);

  return (
    <div
      className={[
        classes['layout'],
        isHome || isOtherContent ? classes['show-left-panel'] : ''
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
        <div className={classes['left-panel']} hidden={!showOtherContent}>
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
