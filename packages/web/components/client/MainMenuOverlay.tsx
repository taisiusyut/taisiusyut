import React from 'react';
import router from 'next/router';
import { Icon } from '@blueprintjs/core';
import {
  ListItem,
  ListSpacer,
  ListViewFooter,
  ListViewDialogProps,
  ListViewOverlay
} from '@/components/ListViewOverlay';
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
import { Github } from '@/components/Github';
import { widthAddtoHomeScreen } from '@/components/widthAddtoHomeScreen';
import { useBoolean } from '@/hooks/useBoolean';
import { useAuth } from '@/hooks/useAuth';
import { useClientPreferences } from '@/hooks/useClientPreferences';
import { withAuthRequired } from './withAuthRequired';
import pkg from '../../package.json';

interface MainMenuDialogProps extends ListViewDialogProps {}

interface OnClick {
  onClick?: (event: React.MouseEvent<any>) => void;
}

const AuthrizedListItem = withAuthRequired(ListItem);

const AddtoHomeScreen = widthAddtoHomeScreen(function ({ onClick }) {
  return (
    <>
      <ListSpacer />
      <ListItem icon="plus" rightElement={chevron} onClick={onClick}>
        加至主畫面
      </ListItem>
    </>
  );
});

const chevron = <Icon icon="chevron-right" />;

export const MainMenuOverlayIcon = 'menu';
export const MainMenuOverlayTitle = '主選單';

export function MainMenuOverlay(props: MainMenuDialogProps) {
  const [auth, authActions] = useAuth();
  const [preferences, preferncesActions] = useClientPreferences();

  return (
    <ListViewOverlay
      {...props}
      icon={MainMenuOverlayIcon}
      title={MainMenuOverlayTitle}
    >
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

      <ListItem
        icon="search"
        rightElement={chevron}
        onClick={() => {
          props.onClose();
          router.push('/search');
        }}
      >
        搜索書籍
      </ListItem>

      <ListSpacer />

      <ListItem icon="help" rightElement={chevron}>
        常見問題
      </ListItem>

      <ListItem
        icon={<Github />}
        rightElement={chevron}
        onClick={() => window.open(`https://github.com/Pong420/fullstack`)}
      >
        Github
      </ListItem>

      <AddtoHomeScreen />

      <ListItem icon="code" rightElement={pkg.version}>
        Version
      </ListItem>

      <ListViewFooter onClose={props.onClose}></ListViewFooter>
    </ListViewOverlay>
  );
}

export function withMainMenuOverLay<P extends OnClick>(
  Component: React.ComponentType<P>
) {
  return function WithMainMenuOverLay(props: P) {
    const [isOpen, open, close] = useBoolean();
    return (
      <>
        <Component {...props} onClick={open} />
        <MainMenuOverlay isOpen={isOpen} onClose={close} />
      </>
    );
  };
}
