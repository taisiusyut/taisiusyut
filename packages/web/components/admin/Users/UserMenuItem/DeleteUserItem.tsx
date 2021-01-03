import React from 'react';
import { createUserMenuItem, UserMenuItemProps } from './UserMenuItem';
import { Colors } from '@blueprintjs/core';
import { UserStatus } from '@/typings';

const UserMenuItem = createUserMenuItem({
  icon: 'trash',
  intent: 'danger',
  text: 'Delete',
  title: 'Delete User'
});

export function DeleteUserItem(props: Omit<UserMenuItemProps, 'getPayload'>) {
  return (
    <UserMenuItem
      {...props}
      getPayload={() => ({ status: UserStatus.Deleted })}
    >
      <div style={{ width: 300, lineHeight: '1.5em' }}>
        Are you sure to delete{' '}
        <b style={{ color: Colors.RED3 }}>{props.user.nickname}</b> account?
      </div>
    </UserMenuItem>
  );
}
