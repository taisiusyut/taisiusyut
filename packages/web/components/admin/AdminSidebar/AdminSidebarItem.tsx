import React, { ReactNode } from 'react';
import Link from 'next/link';
import router, { SingletonRouter } from 'next/router';
import { Icon, IconName } from '@blueprintjs/core';
import classNames from './AdminSidebar.module.scss';

export interface SidebarItemProps {
  href: string;
  icon: IconName;
  iconSize?: number;
  text?: ReactNode;
  isActive?: (href: string, router: SingletonRouter) => boolean;
}

export function AdminSidebarItem({
  href,
  icon,
  text,
  iconSize = 16,
  isActive = href => href === router.pathname
}: SidebarItemProps) {
  const activeClassName = isActive(href, router) ? classNames.active : '';

  return (
    <Link href={href}>
      <div className={`${classNames.item} ${activeClassName}`.trim()}>
        <div className={classNames['item-content']}>
          <div className={classNames['item-icon']}>
            <Icon icon={icon} iconSize={iconSize} />
          </div>
          <span className={classNames['item-label']}>{text}</span>
        </div>
      </div>
    </Link>
  );
}
