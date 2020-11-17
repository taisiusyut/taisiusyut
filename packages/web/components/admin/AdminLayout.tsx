import { ReactNode } from 'react';
import { AdminSidebar } from './AdminSidebar';
import { AdminPreferencesProvider } from './AdminPreferences';

interface Props {
  children?: ReactNode;
}

export function AdminLayout({ children }: Props) {
  return (
    <AdminPreferencesProvider>
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
              @include padding-x(15px 1px);
              flex: 1 1 auto;
              overflow: hidden;
            }
          `}
        </style>
      </div>
    </AdminPreferencesProvider>
  );
}
