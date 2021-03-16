import { useEffect } from 'react';
import router from 'next/router';
import { UserRole } from '@/typings';
import { AdminLayout } from '@/components/admin/AdminLayout';
// import { AdminHome } from '@/components/admin/AdminHome';

export default function Admin() {
  useEffect(() => {
    router.replace({ pathname: '/admin/book' });
  }, []);
  return <div hidden />;

  // return <AdminHome />;
}

Admin.access = [UserRole.Root, UserRole.Admin, UserRole.Author];
Admin.layout = AdminLayout;
