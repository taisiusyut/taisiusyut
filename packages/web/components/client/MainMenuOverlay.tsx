import React from 'react';
import router from 'next/router';
import { Icon, Spinner } from '@blueprintjs/core';
import {
  ListItem,
  ListSpacer,
  ListViewFooter,
  ListViewDialogProps,
  ListViewOverlay
} from '@/components/ListViewOverlay';
import {
  openClientProfileOverlay,
  ClientProfileOverlayIcon,
  ClientProfileOverlayTitle
} from '@/components/client/ClientProfileOverlay';
import {
  openClientPreferences,
  ClientPreferencesOverlayIcon,
  ClientPreferencesOverlayTitle
} from '@/components/client/ClientPreferencesOverlay';
import { Github } from '@/components/Icon/Github';
import { withAuthRequired } from '@/components/client/withAuthRequired';
import { useBoolean } from '@/hooks/useBoolean';
import { useAuth } from '@/hooks/useAuth';
import { useClientPreferences } from '@/hooks/useClientPreferences';
import pkg from '@/package.json';
import { useRxAsync } from 'use-rx-hooks';

interface MainMenuDialogProps extends ListViewDialogProps {}

interface OnClick {
  onClick?: (event: React.MouseEvent<any>) => void;
}

const AuthrizedListItem = withAuthRequired(ListItem);

const chevron = <Icon icon="chevron-right" />;
const spinner = <Spinner size={18} />;

const delay = (ms: number) => new Promise(_ => setTimeout(_, ms));
const req = () => delay(1000);

function AuthorRequest() {
  const [{ loading }, { fetch }] = useRxAsync(req, { defer: true });

  return (
    <ListItem
      icon="draw"
      rightElement={loading ? spinner : chevron}
      onClick={loading ? undefined : fetch}
    >
      成為作者
    </ListItem>
  );
}

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
        icon={ClientProfileOverlayIcon}
        rightElement={
          <div>
            <span style={{ marginRight: 5 }}>
              {auth.user?.nickname || '登入 / 註冊'}
            </span>
            {chevron}
          </div>
        }
        onClick={() => openClientProfileOverlay({ auth, actions: authActions })}
      >
        {ClientProfileOverlayTitle}
      </AuthrizedListItem>

      <ListItem
        icon={ClientPreferencesOverlayIcon}
        rightElement={chevron}
        onClick={() =>
          openClientPreferences({
            preferences,
            onUpdate: preferncesActions.update
          })
        }
      >
        {ClientPreferencesOverlayTitle}
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

      <ListItem
        icon="help"
        rightElement={chevron}
        onClick={() => {
          props.onClose();
          router.push('/faq');
        }}
      >
        常見問題
      </ListItem>

      <ListItem
        icon={<Github />}
        rightElement={chevron}
        onClick={() => window.open(`https://github.com/Pong420/taisiusyut`)}
      >
        Github
      </ListItem>

      <ListSpacer />

      <AuthorRequest />

      <ListSpacer />

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
