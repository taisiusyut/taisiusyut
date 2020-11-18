import React from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Books } from '@/components/admin/Books';
import { UserRole } from '@/typings';

export default function BookIndexPage() {
  return <Books />;
}

BookIndexPage.layout = AdminLayout;
BookIndexPage.access = [UserRole.Root, UserRole.Admin, UserRole.Author];
BookIndexPage.redirect = '/admin';
