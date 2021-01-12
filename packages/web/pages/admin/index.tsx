import { UserRole } from '@/typings';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminHome } from '@/components/admin/AdminHome';

export default function Admin() {
  return <AdminHome />;
}

Admin.access = [UserRole.Root, UserRole.Admin, UserRole.Author];
Admin.layout = AdminLayout;
