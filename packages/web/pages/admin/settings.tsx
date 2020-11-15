import React from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { UserRole } from '@/typings';

export default function AdminSettingsPage() {
  return <div>Settings</div>;
}

AdminSettingsPage.layout = AdminLayout;
AdminSettingsPage.access = [UserRole.Root, UserRole.Admin, UserRole.Author];
