import React from 'react';
import Image from 'next/image';
import { Button, Popover } from '@blueprintjs/core';
import { JWTSignPayload } from '@/typings';
import { AdminSideBarHeaderMenu } from './AdminSideBarHeaderMenu';
import classNames from './AdminSidebar.module.scss';

interface Props {
  user: JWTSignPayload;
}

export function AdminSidebarHeader({ user }: Props) {
  return (
    <div className={classNames.header}>
      <div className={classNames.logo}>
        <Image src="/logo.png" layout="fill" priority unoptimized />
      </div>
      <div className={classNames['header-content']}>
        <Popover content={<AdminSideBarHeaderMenu />}>
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
