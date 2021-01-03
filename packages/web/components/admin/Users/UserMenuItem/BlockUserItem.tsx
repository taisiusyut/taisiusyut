import React from 'react';
import { createUserMenuItem, UserMenuItemProps } from './UserMenuItem';
import { Colors } from '@blueprintjs/core';
import { UserStatus } from '@/typings';

const UserMenuItem = createUserMenuItem({
  icon: 'ban-circle',
  intent: 'danger',
  text: 'Block',
  title: 'Block User'
});

export function BlockUserItem(props: Omit<UserMenuItemProps, 'getPayload'>) {
  return (
    <UserMenuItem
      {...props}
      getPayload={() => ({ status: UserStatus.Blocked })}
    >
      <div style={{ width: 300, lineHeight: '1.5em' }}>
        Are you sure to block{' '}
        <b style={{ color: Colors.RED3 }}>{props.user.nickname}</b> account?
      </div>
    </UserMenuItem>
  );
}
