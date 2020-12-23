import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { fromEvent } from 'rxjs';
import { startWith } from 'rxjs/operators';
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
  const [isSearching, setIsSearching] = useState(asPath.startsWith('/search'));
  const [singlePage, setSinglePage] = useState(false);

  const isHome = /^\/(\?.*)?$/.test(asPath);
  const isFeatured = /^\/featured(\?.*)?$/.test(asPath);
  const isSearch = asPath.startsWith('/search');
  const { goBack } = useGoBack();

  useEffect(() => {
    const subscription = fromEvent(window, 'resize')
      .pipe(startWith(null))
      .subscribe(() => {
        setSinglePage(!pagingDisplay || window.innerWidth <= breakPoint);
      });

    return () => subscription.unsubscribe();
  }, [pagingDisplay]);

  // scroll restoration for mobile view
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
        {/* Should not unmount the left panel component. 
            Because the first-time rendering and scroll position restoration not smooth */}
        <div
          className={classes['left-panel']}
          hidden={(singlePage && !isHome) || isSearching}
        >
          <BookShelf />
        </div>
        <div
          className={classes['left-panel']}
          hidden={(singlePage && !isSearch) || !isSearching}
        >
          <ClientSearch
            onLeave={() =>
              goBack({ targetPath: ['/', '/featured'] }).then(() =>
                setIsSearching(false)
              )
            }
          />
        </div>
        {(!singlePage || (!isHome && !isSearch)) && (
          <div className={classes['right-panel']}>{children}</div>
        )}
      </div>
      <div className={classes['bottom-navigation']}>
        {(isHome || isFeatured || isSearch) && <BottomNavigation />}
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
