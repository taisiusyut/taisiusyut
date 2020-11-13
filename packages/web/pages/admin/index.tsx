import Link from 'next/link';
import { UserRole } from '@/typings';

import { AdminLayout } from '@/components/admin/AdminLayout';

export default function Admin() {
  return <Link href="/admin/book">Book</Link>;
}

Admin.access = [UserRole.Root, UserRole.Admin, UserRole.Author];
Admin.layout = AdminLayout;
