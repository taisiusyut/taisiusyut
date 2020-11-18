import React from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Settings } from '@/components/admin/Settings';
import { UserRole } from '@/typings';

export default function AdminSettingsPage() {
  return <Settings />;
}

AdminSettingsPage.layout = AdminLayout;
AdminSettingsPage.access = [UserRole.Root, UserRole.Admin, UserRole.Author];
AdminSettingsPage.redirect = '/admin';
