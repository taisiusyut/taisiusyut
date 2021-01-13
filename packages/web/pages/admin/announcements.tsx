import React from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Announcements } from '@/components/admin/Announcements';
import { UserRole } from '@/typings';

export default function AnnouncementsPage() {
  return <Announcements />;
}

AnnouncementsPage.layout = AdminLayout;
AnnouncementsPage.access = [UserRole.Root, UserRole.Admin];
AnnouncementsPage.redirect = '/admin';
