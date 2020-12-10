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
import { useBoolean } from '@/hooks/useBoolean';
import { useAuth } from '@/hooks/useAuth';
import dayjs from 'dayjs';

const handleClick = () => void 0;

const chevron = <Icon icon="chevron-right" />;

const ModifyPassword = withModifyPassword(ListItem);
const UpdateProfile = withUpdateProfile(ListItem);

export function ClientProfileDialog(props: ListViewDialogProps) {
  const [auth, { logout }] = useAuth();

  if (auth.loginStatus !== 'loggedIn') {
    return null;
  }

  return (
    <ListViewDialog {...props} icon="user" title="帳號">
      <ListSpacer />

      <ListItem rightElement={auth.user.nickname}>暱稱</ListItem>

      <ListItem
        onClick={handleClick}
        rightElement={dayjs(auth.user.createdAt).format(`YYYY年MM日DD日`)}
      >
        註冊日期
      </ListItem>

      <ListSpacer />

      <ModifyPassword rightElement={chevron}>更改密碼</ModifyPassword>

      <UpdateProfile rightElement={chevron}>更改帳號資料</UpdateProfile>

      <ListSpacer />

      <ListItem onClick={handleClick} rightElement={chevron}>
        付費記錄
      </ListItem>

      <ListSpacer />

      <ListViewDialogFooter>
        <Button
          fill
          text="登出"
          intent="danger"
          onClick={(event: SyntheticEvent<HTMLElement>) => {
            logout();
            props.onClose && props.onClose(event);
          }}
        />
      </ListViewDialogFooter>
    </ListViewDialog>
  );
}

const ClientProfileButton = withAuthRequired(Button);

export function ClientProfile(props: IButtonProps) {
  const [isOpen, open, close] = useBoolean();
  return (
    <>
      <ClientProfileButton {...props} minimal icon="user" onClick={open} />
      <ClientProfileDialog isOpen={isOpen} onClose={close} />
    </>
  );
}
