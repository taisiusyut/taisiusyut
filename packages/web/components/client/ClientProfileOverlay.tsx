import React from 'react';
import { Button, Icon } from '@blueprintjs/core';
import {
  ListViewOverlay,
  ListViewOverlayProps,
  ListItem,
  ListSpacer,
  ListViewFooter
} from '@/components/ListViewOverlay';
import { openModifyPasswordOverlay } from '@/components/client/ModifyPasswordOverlay';
import { openProfileUpdateOverlay } from '@/components/client/ProfileUpdateOverlay';
import { openLoginRecordsOverlay } from '@/components/client/LoginRecordsOverlay';
import { AuthState, AuthActions } from '@/hooks/useAuth';
import { createOpenOverlay } from '@/utils/openOverlay';
import dayjs from 'dayjs';

const chevron = <Icon icon="chevron-right" />;

export interface ClientProfileOverlayProps extends ListViewOverlayProps {
  auth: AuthState;
  actions: AuthActions;
}

export const openClientProfileOverlay = createOpenOverlay(ClientProfileOverlay);

export const ClientProfileOverlayIcon = 'user';
export const ClientProfileOverlayTitle = '帳號';

export function ClientProfileOverlay({
  auth,
  actions,
  ...props
}: ClientProfileOverlayProps) {
  if (auth.loginStatus !== 'loggedIn') {
    return null;
  }

  return (
    <ListViewOverlay
      {...props}
      icon={ClientProfileOverlayIcon}
      title={ClientProfileOverlayTitle}
    >
      <ListSpacer />

      <ListItem rightElement={auth.user.nickname}>暱稱</ListItem>

      <ListItem
        rightElement={dayjs(auth.user.createdAt).format(`YYYY年MM日DD日`)}
      >
        註冊日期
      </ListItem>

      <ListSpacer />

      <ListItem
        rightElement={chevron}
        onClick={() => openModifyPasswordOverlay({ logout: actions.logout })}
      >
        更改密碼
      </ListItem>

      <ListItem
        rightElement={chevron}
        onClick={() => openProfileUpdateOverlay({ auth, actions })}
      >
        更改帳號資料
      </ListItem>

      <ListItem
        rightElement={chevron}
        onClick={() => openLoginRecordsOverlay({})}
      >
        已登入裝置
      </ListItem>

      <ListViewFooter onClose={props.onClose}>
        <Button
          fill
          text="登出"
          intent="danger"
          onClick={() => {
            actions.logout();
            props.onClose && props.onClose();
          }}
        />
      </ListViewFooter>
    </ListViewOverlay>
  );
}
