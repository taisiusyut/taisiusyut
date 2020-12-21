import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { BookShelfProvider } from '@/hooks/useBookShelf';
import { BreakPointsProvider } from '@/hooks/useBreakPoints';
import { ClientPreferencesProvider } from '@/hooks/useClientPreferences';
import { BookShelf } from '../BookShelf';
import { ClientSearch } from '../ClientSearch';
import { BottomNavigation } from '../BottomNavigation';
import classes from './ClientLayout.module.scss';
import { useGoBack } from '@/hooks/useGoBack';

interface Props {
  children?: ReactNode;
}

const scrollRestoration: Record<string, number> = {};

function ClientLayoutContent({ children }: Props) {
  const { asPath, events } = useRouter();
  const [isSearch, setIsSearch] = useState(asPath.startsWith('/search'));
  const isHome = /^\/(\?.*)?$/.test(asPath);
  const isFeatured = /^\/featured(\?.*)?$/.test(asPath);
  const goback = useGoBack();

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
      setIsSearch(isSearch =>
        window.innerWidth > 768
          ? isSearch || asPath.startsWith('/search')
          : asPath.startsWith('/search')
      ),
    [asPath]
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
        <div className={classes['left-panel']} hidden={isSearch}>
          <BookShelf />
        </div>
        {isSearch && (
          <div className={classes['left-panel']}>
            <ClientSearch
              onLeave={() =>
                goback({ targetPath: ['/', '/featured'] }).then(() =>
                  setIsSearch(false)
                )
              }
            />
          </div>
        )}
        <div className={classes['right-panel']}>{children}</div>
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
