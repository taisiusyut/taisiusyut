import React from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminFAQ } from '@/components/admin/AdminFAQ';
import { UserRole } from '@/typings';

export default function FAQPage() {
  return <AdminFAQ />;
}

FAQPage.access = [UserRole.Root, UserRole.Admin, UserRole.Author];
FAQPage.layout = AdminLayout;
