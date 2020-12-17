import React from 'react';
import classes from './BottomNavigation.module.scss';
import { Icon, IIconProps } from '@blueprintjs/core';

type DivProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

interface ItemProps extends DivProps {
  icon?: IIconProps['icon'];
}

function Item({ icon, children, ...props }: ItemProps) {
  return (
    <div {...props} className={classes['item']}>
      <Icon icon={icon} />
      <div className={classes['text']}>{children}</div>
    </div>
  );
}

export function BottomNavigation() {
  return (
    <div className={classes['bottom-navigation']}>
      <div className={classes['content']}>
        <Item icon="book">書架</Item>
        <Item icon="star">精選</Item>
        <Item icon="search">搜索</Item>
        <Item icon="menu">選項</Item>
      </div>
    </div>
  );
}
