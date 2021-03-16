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
import { ClientSearch } from '../ClientSearch';
import { ClientReports } from '../ClientReports';
import { BottomNavigation } from '../BottomNavigation';
import classes from './ClientLayout.module.scss';

export interface ClientLayoutProps {
  children?: ReactNode;
  disableScrollRestoration?: boolean;
}

const breakPoint = 768;

// const otherContentPaths = ['/search', '/reports'];
function shouldShowOtherContent(asPath: string) {
  return ['/search', '/reports'].some(path => asPath.startsWith(path));
}

function OtherContent({
  asPath,
  onLeave
}: {
  asPath: string;
  onLeave: () => void;
}) {
  const pathname = asPath.replace(/^\/|\?.*/g, '');
  switch (pathname) {
    case 'search':
      return <ClientSearch onLeave={onLeave} />;
    case 'reports':
      return <ClientReports onLeave={onLeave} />;
    default:
      return null;
  }
}

function ClientLayoutContent({
  children,
  disableScrollRestoration = false
}: ClientLayoutProps) {
  const { asPath } = useRouter();
  const { goBack } = useGoBack();
  const { pagingDisplay } = useClientPreferencesState();

  const isHome = /^\/(\?.*)?$/.test(asPath);
  const isFeatured = /^\/featured(\?.*)?$/.test(asPath);
  const isSearch = asPath.startsWith('/search');
  const isOtherContent = shouldShowOtherContent(asPath);

  const [otherContent, setOtherContent] = useState(isSearch);

  const hideBookShelf = (!pagingDisplay && !isHome) || otherContent;
  const hideOtherContent = (!pagingDisplay && !isOtherContent) || !otherContent;
  const showRightPanel = pagingDisplay || (!isHome && !isOtherContent);
  const mountBottomNav = isHome || isFeatured || isSearch;

  const leaveOtherContent = () =>
    goBack({ targetPath: ['/', '/featured'] }).then(() =>
      setOtherContent(false)
    );

  // scroll restoration for single page display
  useScrollRestoration(disableScrollRestoration);

  useEffect(
    () =>
      setOtherContent(otherContent =>
        window.innerWidth > breakPoint
          ? otherContent || isOtherContent
          : isOtherContent
      ),
    [asPath, isOtherContent]
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
        <div className={classes['left-panel']} hidden={hideOtherContent}>
          <OtherContent asPath={asPath} onLeave={leaveOtherContent} />
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
