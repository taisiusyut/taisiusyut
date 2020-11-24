import { UserRole } from '@/typings';
import { AdminLayout } from '@/components/admin/AdminLayout';

export default function Admin() {
  return <div>Admin Home</div>;
}

Admin.access = [UserRole.Root, UserRole.Admin, UserRole.Author];
Admin.layout = AdminLayout;
