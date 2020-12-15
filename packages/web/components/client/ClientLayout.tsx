import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { fromEvent } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { BookShelfProvider } from '@/hooks/useBookShelf';
import { BreakPointsProvider } from '@/hooks/useBreakPoints';
import {
  ClientPreferencesProvider,
  useClientPreferencesState
} from '@/hooks/useClientPreferences';
import { BookShelf } from './BookShelf';

interface Props {
  children?: ReactNode;
}

const breakPoint = 768;

function ClientLayoutContent({ children }: Props) {
  const { pagingDisplay } = useClientPreferencesState();
  const { asPath } = useRouter();
  const [singlePage, setSinglePage] = useState(false);

  useEffect(() => {
    const subscription = fromEvent(window, 'resize')
      .pipe(startWith(null))
      .subscribe(() => {
        setSinglePage(!pagingDisplay || window.innerWidth <= breakPoint);
      });

    return () => subscription.unsubscribe();
  }, [pagingDisplay]);

  return (
    <div className={`layout ${asPath === '/' ? 'home' : ''}`.trim()}>
      <BreakPointsProvider>
        <div className="layout-body">
          {(!singlePage || asPath === '/') && (
            <div className="book-shelf">
              <BookShelf />
            </div>
          )}
          {(!singlePage || asPath !== '/') && (
            <div className="layout-content">{children}</div>
          )}
        </div>
      </BreakPointsProvider>
      <style jsx>
        {`
          .layout {
            @include sq-dimen(100%);
            background-color: var(--secondary-color);
            min-height: 100%;
          }

          .layout-body {
            @include sq-dimen(100%);
            @include margin-x(auto);
            @include flex();
            min-height: 100%;

            :global([data-width='fixed']) & {
              $target-width: 1280px;
              @media (min-width: $target-width) {
                max-width: $target-width;
              }
            }
          }

          .layout-content {
            @include sq-dimen(100%);
            @include flex($flex-direction: column);
            @include shadow-border();
            flex: 1 1 auto;
            overflow: hidden;
          }

          .book-shelf {
            flex: 1 1 auto;
            min-width: 300px;
          }

          @media (max-width: ${breakPoint}px) {
            .layout {
              &.home .book-shelf ~ * {
                display: none;
              }

              &:not(.home) .book-shelf {
                display: none;
              }
            }
          }
        `}
      </style>
    </div>
  );
}

export function ClientLayout(props: Props) {
  return (
    <ClientPreferencesProvider>
      <BookShelfProvider>
        <ClientLayoutContent {...props} />
      </BookShelfProvider>
    </ClientPreferencesProvider>
  );
}
