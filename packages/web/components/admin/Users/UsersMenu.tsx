import React from 'react';
import {
  Classes,
  Menu,
  MenuItem,
  Overlay,
  IOverlayProps,
  MenuDivider
} from '@blueprintjs/core';
import { Schema$User } from '@/typings';
import { createOpenOverlay } from '@/utils/openOverlay';
import { UpdateUser, OnUpdate } from './UpdateUser';
import { DeleteUser, OnDelete } from './DeleteUser';

interface UsersMenuProps extends Partial<IOverlayProps>, OnUpdate, OnDelete {
  offset: { top: number; left: number };
  title?: string;
  user: Schema$User;
}

export const openUsersMenu = createOpenOverlay<UsersMenuProps>(UsersMenu);

export function UsersMenu({
  title = '',
  offset,
  user,
  onClose,
  onUpdate,
  onDelete,
  ...props
}: UsersMenuProps) {
  return (
    <Overlay {...props} onClose={onClose} hasBackdrop={false}>
      <div className={Classes.POPOVER} style={offset}>
        <Menu>
          <MenuDivider title={title} />
          <MenuDivider />
          <UpdateUser onUpdate={onUpdate} user={user} onClick={onClose} />
          <DeleteUser
            id={user.id}
            nickname={user.nickname}
            onDelete={onDelete}
            onClick={onClose}
          />
          <MenuDivider />
          <MenuItem icon="cross" text="Close" onClick={onClose} />
        </Menu>
      </div>
    </Overlay>
  );
}
