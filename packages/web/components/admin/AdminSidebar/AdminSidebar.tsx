import React from 'react';
import { Divider } from '@blueprintjs/core';
import { AdminSidebarHeader } from './AdminSidebarHeader';
import { AdminSidebarItem } from './AdminSidebarItem';
import classNames from './AdminSidebar.module.scss';

export function AdminSidebar() {
  return (
    <div className={classNames.sidebar}>
      <div className={classNames.inner}>
        <AdminSidebarHeader />
        <Divider />
        <div className={classNames.content}>
          <AdminSidebarItem href="/admin" icon="home">
            Home
          </AdminSidebarItem>
          <AdminSidebarItem href="/admin/book" icon="inbox">
            Books
          </AdminSidebarItem>
          <AdminSidebarItem href="/3" icon="user">
            Users
          </AdminSidebarItem>
          <AdminSidebarItem href="/4" icon="cog">
            Settings
          </AdminSidebarItem>
        </div>
      </div>
    </div>
  );
}
