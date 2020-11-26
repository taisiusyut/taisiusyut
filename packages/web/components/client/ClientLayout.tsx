import { ReactNode } from 'react';
import { BookShelf } from './BookShelf';

interface Props {
  children?: ReactNode;
}

export function ClientLayout({ children }: Props) {
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
            @include dimen(100%);
            @include margin-x(auto);
            @include flex();
            min-height: 100%;
          }

          .layout-content {
            @include dimen(100%);
            flex: 1 1 auto;
            overflow: hidden;
          }
        `}
      </style>
    </div>
  );
}
