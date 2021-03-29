import { useMemo, useEffect, useState } from 'react';
import router, { useRouter } from 'next/router';
import { useGoBack } from '@/hooks/useGoBack';
import { BookShelfProvider } from '@/hooks/useBookShelf';
import { BreakPointsProvider, useBreakPoints } from '@/hooks/useBreakPoints';
import { useScrollRestoration } from '@/hooks/useScrollRestoration';
import {
  ClientPreferencesProvider,
  useClientPreferencesState
} from '@/hooks/useClientPreferences';
import { composeProviders, ProviderProps } from '@/utils/composeProviders';
import { BookShelf } from '../BookShelf';
import { BottomNavigation } from '../BottomNavigation';
import classes from './ClientLayout.module.scss';

export interface ClientLeftPanelProps {
  onLeave: () => void;
}

export interface ClientLayoutProps {
  children?: React.ReactElement;
  leftPanel?: React.ComponentType<ClientLeftPanelProps>;
  providers?: React.ComponentType<ProviderProps>[];
  disableScrollRestoration?: boolean;
}

function getFlags(asPath: string, isPagingDisplay: boolean) {
  const isHome = asPath === '/';
  const isSearch = asPath.startsWith('/search');
  const isFeatured = asPath.startsWith('/featured');
  const mountBottomNav = isHome || isFeatured || isSearch;

  const common = {
    isHome,
    isFeatured,
    mountBottomNav
  };

  if (isPagingDisplay) {
    return {
      ...common,
      showLeftPanel: true,
      showRightPanel: true
    };
  }

  const showLeftPanel = !isFeatured && asPath.lastIndexOf('/') === 0;
  return {
    ...common,
    showLeftPanel,
    showRightPanel: !showLeftPanel
  };
}

function ClientLayoutContent({
  children,
  leftPanel,
  disableScrollRestoration = false
}: ClientLayoutProps) {
  const { asPath, events } = useRouter();
  const { goBack } = useGoBack();
  const { pagingDisplay } = useClientPreferencesState();
  const [breakPoint, mounted] = useBreakPoints();

  // set `isPagingDisplay` to true make sure right panel will mount while build
  const [flags, setFlags] = useState(getFlags(asPath, true));
  const { showRightPanel, showLeftPanel, mountBottomNav } = flags;

  const [leaveOtherLeftPanel] = useState(() => () =>
    goBack({ targetPath: ['/', '/featured'] }).then(() => {
      setLeftPanel(() => BookShelf);
    })
  );

  const [LeftPanel, setLeftPanel] = useState(() => leftPanel || BookShelf);

  useEffect(() => {
    leftPanel && setLeftPanel(() => leftPanel);
  }, [leftPanel]);

  // scroll restoration for single page display
  useScrollRestoration(disableScrollRestoration);

  useEffect(() => {
    const handler = (pathname: string) => {
      const isPagingDisplay = pagingDisplay && breakPoint > 768;
      const newState = getFlags(pathname, isPagingDisplay);

      if (newState.isHome || newState.isFeatured) {
        setLeftPanel(() => BookShelf);
      }

      setFlags(newState);

      // Fix for ClientSearch style removeal while item is active (production only)
      // https://github.com/vercel/next.js/issues/17464#issuecomment-711330281
      document
        .querySelectorAll('style[media="x"]')
        .forEach(el => el.removeAttribute('media'));
    };

    handler(router.asPath);
    events.on('routeChangeComplete', handler);
    return () => {
      events.off('routeChangeComplete', handler);
    };
  }, [events, pagingDisplay, breakPoint]);

  return (
    <div className={[classes['layout']].join(' ').trim()}>
      <div className={classes['layout-content']}>
        {/* should not unmount the left panel component. 
            because the first-time rendering and scroll position restoration will not smooth */}
        <div
          className={classes['left-panel']}
          hidden={!mounted || !LeftPanel || !showLeftPanel}
        >
          <LeftPanel onLeave={leaveOtherLeftPanel} />
        </div>
        {showRightPanel && (
          <div className={classes['right-panel']} hidden={!mounted}>
            {children}
          </div>
        )}
      </div>
      <div className={classes['bottom-navigation']}>
        {mountBottomNav && <BottomNavigation />}
      </div>
    </div>
  );
}

export function ClientLayout(props: ClientLayoutProps) {
  const Provider = useMemo(
    () =>
      composeProviders(
        ClientPreferencesProvider,
        BookShelfProvider,
        BreakPointsProvider,
        ...(props.providers || [])
      ),
    [props.providers]
  );

  return (
    <Provider>
      <ClientLayoutContent {...props} />
    </Provider>
  );
}
