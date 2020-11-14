import { ReactNode } from 'react';
import { AdminSidebar } from './AdminSidebar';

interface Props {
  children?: ReactNode;
}

export function AdminLayout({ children }: Props) {
  return (
    <div className="layout">
      <div className="layout-body">
        <AdminSidebar />
        <div className="layout-content">{children}</div>
      </div>
      <style jsx>
        {`
          .layout {
            @include sq-dimen(100%);
            background-color: var(--main-diff1-color);
            min-height: 100%;
          }

          .layout-body {
            @include dimen(100%);
            @include margin-x(auto);
            @include flex();
            max-width: $max-width;
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