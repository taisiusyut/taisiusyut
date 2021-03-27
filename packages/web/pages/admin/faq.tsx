import React from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminFAQ } from '@/components/admin/AdminFAQ';

export default function FAQPage() {
  return <AdminFAQ />;
}

FAQPage.layout = AdminLayout;
