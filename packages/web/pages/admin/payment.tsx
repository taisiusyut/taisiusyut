import React from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Payment } from '@/components/admin/Payment';
import { UserRole } from '@/typings';

export default function AdminPaymentPage() {
  return <Payment />;
}

AdminPaymentPage.layout = AdminLayout;
AdminPaymentPage.access = [UserRole.Root, UserRole.Admin];
AdminPaymentPage.redirect = '/admin';
