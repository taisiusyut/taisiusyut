import React from 'react';
import { useRouter } from 'next/router';
import { Icon, IIconProps } from '@blueprintjs/core';
import { withMainMenuOverLay } from '@/components/client/MainMenuOverlay';
import classes from './BottomNavigation.module.scss';

type DivProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

interface ItemProps extends DivProps {
  icon?: IIconProps['icon'];
  isActive?: boolean;
}

function Item({ icon, children, isActive, ...props }: ItemProps) {
  return (
    <div
      {...props}
      className={[classes['item'], isActive ? classes['active'] : '']
        .join(' ')
        .trim()}
    >
      <Icon icon={icon} />
      <div className={classes['text']}>{children}</div>
    </div>
  );
}

function NavItem({ path, ...props }: ItemProps & { path: string }) {
  const { asPath, push } = useRouter();
  return (
    <Item
      {...props}
      isActive={new RegExp(`^${path}(\\?.*)?$`).test(asPath)}
      onClick={() => push(path)}
    />
  );
}

const MainMenuTrigger = withMainMenuOverLay(Item);

export function BottomNavigation() {
  return (
    <div className={classes['bottom-navigation']}>
      <div className={classes['content']}>
        <NavItem icon="book" path="/">
          書架
        </NavItem>
        <NavItem icon="star" path="/featured">
          精選
        </NavItem>
        <NavItem icon="search" path="/search">
          搜索
        </NavItem>
        <MainMenuTrigger icon="menu">選項</MainMenuTrigger>
      </div>
    </div>
  );
}
