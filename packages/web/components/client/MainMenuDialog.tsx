import React from 'react';
import { Icon } from '@blueprintjs/core';
import {
  ListItem,
  ListSpacer,
  ListViewDialog,
  ListViewDialogFooter,
  ListViewDialogProps
} from '@/components/ListViewDialog';
import {
  openClientProfileDialog,
  ClientProfileDialogIcon,
  ClientProfileDialogTitle
} from '@/components/client/ClientProfile';
import {
  openClientPreferences,
  ClientPreferencesDialogIcon,
  ClientPreferencesDialogTitle
} from '@/components/client/ClientPreferences';
import { useAuth } from '@/hooks/useAuth';
import { useClientPreferences } from '@/hooks/useClientPreferences';
import { withAuthRequired } from './withAuthRequired';
import { ButtonPopover, ButtonPopoverProps } from '../ButtonPopover';
import { useBoolean } from '@/hooks/useBoolean';

interface MainMenuDialogProps extends ListViewDialogProps {}

const AuthrizedListItem = withAuthRequired(ListItem);

const chevron = <Icon icon="chevron-right" />;

const icon = 'menu';
const title = '主選單';

export function MainMenuDialog(props: MainMenuDialogProps) {
  const [auth, authActions] = useAuth();
  const [preferences, preferncesActions] = useClientPreferences();

  return (
    <ListViewDialog {...props} icon="menu" title="主選單">
      <ListSpacer />

      <AuthrizedListItem
        icon={ClientProfileDialogIcon}
        rightElement={
          <div>
            <span style={{ marginRight: 5 }}>
              {auth.user?.nickname || '登入 / 註冊'}
            </span>
            {chevron}
          </div>
        }
        onClick={() => openClientProfileDialog({ auth, actions: authActions })}
      >
        {ClientProfileDialogTitle}
      </AuthrizedListItem>

      <ListItem
        icon={ClientPreferencesDialogIcon}
        rightElement={chevron}
        onClick={() =>
          openClientPreferences({
            preferences,
            onUpdate: preferncesActions.update
          })
        }
      >
        {ClientPreferencesDialogTitle}
      </ListItem>

      <ListSpacer />

      <ListItem icon="info-sign" rightElement={chevron}>
        常見問題
      </ListItem>

      <ListViewDialogFooter onClose={props.onClose}></ListViewDialogFooter>
    </ListViewDialog>
  );
}

export function MainMenuButton(props: ButtonPopoverProps) {
  const [isOpen, open, close] = useBoolean();
  return (
    <>
      <ButtonPopover
        {...props}
        minimal
        icon={icon}
        content={title}
        onClick={open}
      />
      <MainMenuDialog isOpen={isOpen} onClose={close} />
    </>
  );
}
