import React from 'react';
import { MenuItem } from '@blueprintjs/core';
import { UserStatus, UserRole } from '@/typings';
import { createOpenOverlay } from '@/utils/openOverlay';
import { User, OnUpdate, UserActionDialogProps } from './UserActionDialog';
import { BlockUserDialog } from './BlockUser';
import { DeleteUserDialog } from './DeleteUser';
import { UpdateUserDialog } from './UpdateUser';
import { RecoverUserDialog } from './RecoverUser';

export interface UserActionsProps extends User, OnUpdate {
  role?: UserRole;
}

export function UserActions({ user, onUpdate }: UserActionsProps) {
  const create = (
    prefix: string,
    icon: UserActionDialogProps['icon'],
    Component: React.ComponentType<UserActionDialogProps>
  ) => {
    return (
      <MenuItem
        icon={icon}
        key={prefix}
        text={prefix}
        onClick={() => createOpenOverlay(Component)({ prefix, user, onUpdate })}
      />
    );
  };

  const items: React.ReactElement[] = [];

  if (user.status) {
    if ([UserStatus.Blocked, UserStatus.Deleted].includes(user.status)) {
      items.push(create('Recover', 'undo', RecoverUserDialog));
    } else {
      items.push(
        create('Update', 'edit', UpdateUserDialog),
        create('Block', 'ban-circle', BlockUserDialog),
        create('Delete', 'trash', DeleteUserDialog)
      );
    }
  }

  return <>{items}</>;
}
