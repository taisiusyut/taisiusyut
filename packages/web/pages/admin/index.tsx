import { UserRole } from '@/typings';

export default function Admin() {
  return <div>Admin</div>;
}

Admin.access = [UserRole.Root, UserRole.Admin, UserRole.Author];
