import React from 'react';
import Link from 'next/link';
import { AdminLayout } from '@/components/admin/AdminLayout';

export default function BookIndexPage() {
  return <Link href="/admin">Admin Home</Link>;
}

BookIndexPage.layout = AdminLayout;
