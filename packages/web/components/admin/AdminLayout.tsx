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
              background-color: var(--secondary-color);
              font-size: $pt-font-size;
              font-weight: 400;
              font-family: 'Muli', #{$base-font-family};
            }

            .layout-body {
              @include sq-dimen(100%);
              @include margin-x(auto);
              @include flex();
              max-width: $max-width;
              height: 100vh;
              height: calc(var(--vh, 1vh) * 100);
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
