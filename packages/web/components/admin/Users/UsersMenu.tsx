import React from 'react';
import router from 'next/router';
import {
  Classes,
  Menu,
  MenuItem,
  Overlay,
  IOverlayProps,
  MenuDivider
} from '@blueprintjs/core';
import { Schema$User, UserRole } from '@/typings';
import { createOpenOverlay } from '@/utils/openOverlay';
import { UserActions, OnSuccess } from './UserActions';

interface UsersMenuProps extends Partial<IOverlayProps>, OnSuccess {
  offset: { top: number; left: number };
  title?: string;
  role?: UserRole;
  user: Schema$User;
}

export const openUsersMenu = createOpenOverlay<UsersMenuProps>(UsersMenu);

export function UsersMenu({
  offset,
  role,
  user,
  onClose,
  onSuccess,
  ...props
}: UsersMenuProps) {
  return (
    <Overlay {...props} onClose={onClose} hasBackdrop={false}>
      <div className={Classes.POPOVER} style={offset}>
        <Menu onClick={event => onClose && onClose(event)}>
          <MenuItem
            icon="user"
            text={user.nickname}
            onClick={() => {
              router.push({ search: `id=${user.id}` }, undefined, {
                shallow: true
              });
            }}
          />

          <MenuDivider />

          <UserActions role={role} user={user} onSuccess={onSuccess} />

          <MenuDivider />
          <MenuItem icon="cross" text="Close" />
        </Menu>
      </div>
    </Overlay>
  );
}
