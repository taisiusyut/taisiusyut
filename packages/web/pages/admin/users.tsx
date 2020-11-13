import React from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Users } from '@/components/admin/Users';
import { UserRole } from '@/typings';

export default function AdminUsersPage() {
  return <Users />;
}

AdminUsersPage.layout = AdminLayout;
AdminUsersPage.access = [UserRole.Root, UserRole.Admin, UserRole.Author];
