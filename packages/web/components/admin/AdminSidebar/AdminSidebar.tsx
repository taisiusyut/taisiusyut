import React from 'react';
import { Divider } from '@blueprintjs/core';
import { UserRole } from '@/typings';
import { useAuthState } from '@/hooks/useAuth';
import { AdminSidebarHeader } from './AdminSidebarHeader';
import { AdminSidebarItem, SidebarItemProps } from './AdminSidebarItem';
import classNames from './AdminSidebar.module.scss';

interface ItemOptions extends SidebarItemProps {
  access: UserRole[];
}

const itemsOptions: ItemOptions[] = [
  {
    href: '/admin',
    icon: 'home',
    text: '首頁',
    access: [UserRole.Root, UserRole.Admin, UserRole.Author]
  },
  {
    href: '/admin/book',
    icon: 'book',
    text: '書籍',
    access: [UserRole.Root, UserRole.Admin, UserRole.Author],
    isActive: (_, router) => {
      return router.pathname.startsWith('/admin/book');
    }
  },
  {
    href: '/admin/announcements',
    icon: 'document',
    text: '公告',
    access: [UserRole.Root, UserRole.Admin]
  },
  {
    href: '/admin/users',
    icon: 'user',
    text: '用戶',
    access: [UserRole.Root, UserRole.Admin]
  },
  {
    href: '/admin/settings',
    icon: 'cog',
    text: '設定',
    access: [UserRole.Root, UserRole.Admin, UserRole.Author]
  }
];

if (process.env.NEXT_PUBLIC_GUEST) {
  for (const option of itemsOptions) {
    option.access.push(process.env.NEXT_PUBLIC_GUEST as UserRole);
  }
}

export function AdminSidebar() {
  const { user } = useAuthState();

  if (!user) {
    throw new Error(`user is not defined`);
  }

  return (
    <div className={classNames.sidebar}>
      <div className={classNames.inner}>
        <AdminSidebarHeader user={user} />
        <Divider />
        <div className={classNames.content}>
          {itemsOptions.map(({ access, ...props }) =>
            access.includes(user.role) ? (
              <AdminSidebarItem key={props.href} {...props} />
            ) : null
          )}
        </div>
      </div>
    </div>
  );
}
