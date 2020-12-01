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
          <UpdateUser onUpdate={onUpdate} user={user} />
          <DeleteUser
            id={user.id}
            nickname={user.nickname}
            onDelete={onDelete}
          />
          <MenuDivider />
          <MenuItem icon="cross" text="Close" />
        </Menu>
      </div>
    </Overlay>
  );
}
