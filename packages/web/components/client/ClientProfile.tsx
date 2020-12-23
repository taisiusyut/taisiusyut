import React from 'react';
import { Button, IButtonProps, Icon } from '@blueprintjs/core';
import {
  ListViewOverlay,
  ListViewOverlayProps,
  ListItem,
  ListSpacer,
  ListViewFooter
} from '@/components/ListViewOverlay';
import { withAuthRequired } from '@/components/client/withAuthRequired';
import { withModifyPassword } from '@/components/client/withModifyPassword';
import { withUpdateProfile } from '@/components/client/withUpdateProfile';
import { openLoginRecordsDialog } from '@/components/client/LoginRecordsDialog';
import { useAuth } from '@/hooks/useAuth';
import { AuthState, AuthActions } from '@/hooks/useAuth';
import { createOpenOverlay } from '@/utils/openOverlay';
import dayjs from 'dayjs';

const chevron = <Icon icon="chevron-right" />;

const ModifyPassword = withModifyPassword(ListItem);
const UpdateProfile = withUpdateProfile(ListItem);

export interface ClientProfileDialogProps extends ListViewOverlayProps {
  auth: AuthState;
  actions: AuthActions;
}

export const openClientProfileDialog = createOpenOverlay(ClientProfileDialog);

export const ClientProfileDialogIcon = 'user';
export const ClientProfileDialogTitle = '帳號';

export function ClientProfileDialog({
  auth,
  actions,
  ...props
}: ClientProfileDialogProps) {
  if (auth.loginStatus !== 'loggedIn') {
    return null;
  }

  return (
    <ListViewOverlay
      {...props}
      icon={ClientProfileDialogIcon}
      title={ClientProfileDialogTitle}
    >
      <ListSpacer />

      <ListItem rightElement={auth.user.nickname}>暱稱</ListItem>

      <ListItem
        rightElement={dayjs(auth.user.createdAt).format(`YYYY年MM日DD日`)}
      >
        註冊日期
      </ListItem>

      <ListSpacer />

      <ModifyPassword logout={actions.logout} rightElement={chevron}>
        更改密碼
      </ModifyPassword>

      <UpdateProfile auth={auth} actions={actions} rightElement={chevron}>
        更改帳號資料
      </UpdateProfile>

      <ListItem
        rightElement={chevron}
        onClick={() => openLoginRecordsDialog({})}
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

const ClientProfileButton = withAuthRequired(Button);

export function ClientProfile(props: IButtonProps) {
  const [auth, actions] = useAuth();
  return (
    <>
      <ClientProfileButton
        {...props}
        minimal
        icon="user"
        onClick={() => openClientProfileDialog({ auth, actions })}
      />
    </>
  );
}
