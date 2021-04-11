import { ReactNode } from 'react';
import { Meta } from '@/components/Meta';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminPreferencesProvider } from '@/hooks/useAdminPreferences';
import classes from './AdminLayout.module.scss';

interface Props {
  children?: ReactNode;
}

export function AdminLayout({ children }: Props) {
  return (
    <AdminPreferencesProvider>
      <div className={classes['classes']}>
        <Meta robots="none" />
        <div className={classes['layout-body']}>
          <AdminSidebar />
          <div className={classes['layout-content']}>{children}</div>
        </div>
      </div>
    </AdminPreferencesProvider>
  );
}
