import { ReactNode } from 'react';
import { AdminPreferencesProvider } from '@/hooks/useAdminPreferences';
import { AdminSidebar } from './AdminSidebar';
import { Meta } from '../Meta';

interface Props {
  children?: ReactNode;
}

export function AdminLayout({ children }: Props) {
  return (
    <AdminPreferencesProvider>
      <div className="layout">
        <Meta robots="none" />
        <div className="layout-body">
          <AdminSidebar />
          <div className="layout-content">{children}</div>
        </div>
        <style jsx>
          {`
            .layout {
              @include sq-dimen(100%);
              background-color: var(--secondary-color);
              min-height: 100%;
              overflow: auto;
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
              padding: 15px;
              overflow-x: hidden;
            }
          `}
        </style>
      </div>
    </AdminPreferencesProvider>
  );
}
