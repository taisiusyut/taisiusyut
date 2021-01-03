import React from 'react';
import { createUserMenuItem, UserMenuItemProps } from './UserMenuItem';
import { Colors } from '@blueprintjs/core';
import { UserStatus } from '@/typings';

const UserMenuItem = createUserMenuItem({
  icon: 'undo',
  intent: 'success',
  text: 'Recover',
  title: 'Recover User'
});

export function RecoverUserItem(props: Omit<UserMenuItemProps, 'getPayload'>) {
  return (
    <UserMenuItem {...props} getPayload={() => ({ status: UserStatus.Active })}>
      <div style={{ width: 300, lineHeight: '1.5em' }}>
        Are you sure to recover{' '}
        <b style={{ color: Colors.RED3 }}>{props.user.nickname}</b> account?
      </div>
    </UserMenuItem>
  );
}
