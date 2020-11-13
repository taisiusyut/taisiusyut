import { ReactNode } from 'react';
import { AdminSidebar } from './AdminSidebar';

interface Props {
  children?: ReactNode;
}

export function AdminLayout({ children }: Props) {
  return (
    <div className="layout">
      <div className="layout-content">
        <AdminSidebar />
        {children}
      </div>
      <style jsx>
        {`
          .layout {
            @include sq-dimen(100%);
            background-color: var(--main-diff1-color);
          }

          .layout-content {
            @include dimen(100%);
            @include margin-x(auto);
            @include flex();
            max-width: 1440px;
            min-height: 100%;
          }
        `}
      </style>
    </div>
  );
}
