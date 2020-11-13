import React, { ReactNode } from 'react';
import { Icon, IconName } from '@blueprintjs/core';
import { NavLink } from '@/components/NavLink';
import classNames from './AdminSidebar.module.scss';

export interface SidebarItemProps {
  href: string;
  icon: IconName;
  iconSize?: number;
  text?: ReactNode;
}

export function AdminSidebarItem({
  href,
  icon,
  text,
  iconSize = 16
}: SidebarItemProps) {
  return (
    <NavLink href={href} activeClassName={classNames.active}>
      <div className={classNames.item}>
        <div className={classNames['item-content']}>
          <div className={classNames['item-icon']}>
            <Icon icon={icon} iconSize={iconSize} />
          </div>
          <span className={classNames['item-label']}>{text}</span>
        </div>
      </div>
    </NavLink>
  );
}
