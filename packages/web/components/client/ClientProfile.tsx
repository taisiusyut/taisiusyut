import React, { SyntheticEvent } from 'react';
import { Button, IButtonProps, Icon } from '@blueprintjs/core';
import {
  ListViewDialog,
  ListViewDialogProps,
  ListItem,
  ListSpacer,
  ListViewDialogFooter
} from '@/components/ListViewDialog';
import { withAuthRequired } from '@/components/client/withAuthRequired';
import { withModifyPassword } from '@/components/client/withModifyPassword';
import { withUpdateProfile } from '@/components/client/withUpdateProfile';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/typings';
import { AuthState, AuthActions } from '@/hooks/useAuth';
import { createOpenOverlay } from '@/utils/openOverlay';
import dayjs from 'dayjs';

const handleClick = () => void 0;

const chevron = <Icon icon="chevron-right" />;

const ModifyPassword = withModifyPassword(ListItem);
const UpdateProfile = withUpdateProfile(ListItem);

export interface ClientProfileDialogProps extends ListViewDialogProps {
  auth: AuthState;
  actions: AuthActions;
}

const openClientProfileDialog = createOpenOverlay(ClientProfileDialog);

export function ClientProfileDialog({
  auth,
  actions,
  ...props
}: ClientProfileDialogProps) {
  if (auth.loginStatus !== 'loggedIn') {
    return null;
  }

  return (
    <ListViewDialog {...props} icon="user" title="帳號">
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

      <ListSpacer />

      <ListItem onClick={handleClick} rightElement={chevron}>
        付費記錄
      </ListItem>

      {auth.user.role === UserRole.Client && (
        <>
          <ListSpacer />

          <ListItem onClick={handleClick} rightElement={chevron}>
            我要做作者
          </ListItem>
        </>
      )}

      <ListViewDialogFooter onClose={props.onClose}>
        <Button
          fill
          text="登出"
          intent="danger"
          onClick={(event: SyntheticEvent<HTMLElement>) => {
            actions.logout();
            props.onClose && props.onClose(event);
          }}
        />
      </ListViewDialogFooter>
    </ListViewDialog>
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
