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
import { Schema$User, UserStatus } from '@/typings';
import { createOpenOverlay } from '@/utils/openOverlay';
import {
  OnUpdate,
  BlockUserItem,
  DeleteUserItem,
  UpdateUserItem,
  RecoverUserItem
} from './UserMenuItem';

interface UsersMenuProps extends Partial<IOverlayProps>, OnUpdate {
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
  ...props
}: UsersMenuProps) {
  const itemProps = { onUpdate, user };

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
          {[UserStatus.Blocked, UserStatus.Deleted].includes(user.status) ? (
            <RecoverUserItem {...itemProps} />
          ) : (
            <>
              <UpdateUserItem {...itemProps} />
              <BlockUserItem {...itemProps} />
              <DeleteUserItem {...itemProps} />
            </>
          )}

          <MenuDivider />
          <MenuItem icon="cross" text="Close" />
        </Menu>
      </div>
    </Overlay>
  );
}
