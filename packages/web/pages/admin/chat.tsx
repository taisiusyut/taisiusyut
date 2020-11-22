import React from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Chat } from '@/components/admin/Chat';
import { UserRole } from '@/typings';

export default function AdminChatPage() {
  return <Chat />;
}

AdminChatPage.layout = AdminLayout;
AdminChatPage.access = [UserRole.Root, UserRole.Admin];
AdminChatPage.redirect = '/admin';
