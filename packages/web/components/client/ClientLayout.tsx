import { ReactNode } from 'react';
import { BookShelfProvider } from '@/hooks/useBookShelf';
import { ClientPreferencesProvider } from '@/hooks/useClientPreferences';
import { BookShelf } from './BookShelf';

interface Props {
  children?: ReactNode;
}

function ClientLayoutContent({ children }: Props) {
  return (
    <div className="layout">
      <div className="layout-body">
        <BookShelf />
        <div className="layout-content">{children}</div>
      </div>
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
              max-width: 1280px;
              // prettier-ignore
              box-shadow: 
                0 0 0 1px var(--divider-color), 
                0 0 0 rgba($black, 0),
                0 0 0 rgba($black, 0);
            }
          }

          .layout-content {
            @include sq-dimen(100%);
            @include flex($flex-direction: column);
            flex: 1 1 auto;
            overflow: hidden;
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
