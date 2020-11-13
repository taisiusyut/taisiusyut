import React from 'react';
import Image from 'next/image';
import { Button, Popover, Menu, MenuItem } from '@blueprintjs/core';
import { JWTSignPayload } from '@/typings';
import classNames from './AdminSidebar.module.scss';

interface Props {
  user: JWTSignPayload;
}

function UserMenu() {
  return (
    <Menu>
      <MenuItem icon="log-out" text="Logout" />
    </Menu>
  );
}

export function AdminSidebarHeader({ user }: Props) {
  return (
    <div className={classNames.header}>
      <div className={classNames.logo}>
        <Image src="/logo.png" layout="fill" priority unoptimized />
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
