import React from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { UserRole } from '@/typings';

export default function BookIndexPage() {
  return <div>Book</div>;
}

BookIndexPage.layout = AdminLayout;
BookIndexPage.access = [UserRole.Root, UserRole.Admin, UserRole.Author];
