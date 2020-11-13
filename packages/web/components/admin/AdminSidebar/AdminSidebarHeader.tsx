import React from 'react';
import Image from 'next/image';
import { Button, Popover, Menu, MenuItem } from '@blueprintjs/core';
import { useAuthState } from '@/hooks/useAuth';
import classNames from './AdminSidebar.module.scss';

const imageSize = 75;

function UserMenu() {
  return (
    <Menu>
      <MenuItem icon="log-out" text="Logout" />
    </Menu>
  );
}

export function AdminSidebarHeader() {
  const { user } = useAuthState();

  if (!user) {
    return null;
  }

  return (
    <div className={classNames.header}>
      <div className={classNames.logo}>
        <Image src="/logo.png" width={imageSize} height={imageSize} />
      </div>
      <div className={classNames['header-content']}>
        <Popover content={<UserMenu />}>
          <Button
            small
            minimal
            className={classNames['nick-name']}
            rightIcon="chevron-down"
          >
            {user.nickname}
          </Button>
        </Popover>
        <div className={classNames.role}>{user.role}</div>
      </div>
    </div>
  );
}
