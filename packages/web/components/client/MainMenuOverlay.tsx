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
import { Telegram } from '@/components/Icon/Telegram';
import { withAuthRequired } from '@/components/client/withAuthRequired';
import { AuthorRequest } from '@/components/client/AuthorRequest';
import { useBoolean } from '@/hooks/useBoolean';
import { useAuth } from '@/hooks/useAuth';
import { useClientPreferences } from '@/hooks/useClientPreferences';
import { UserRole } from '@/typings';
import pkg from '@/package.json';

interface MainMenuDialogProps extends ListViewDialogProps {}

interface OnClick {
  onClick?: (event: React.MouseEvent<any>) => void;
}

const AuthrizedListItem = withAuthRequired(ListItem);

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

      {!auth.user || auth.user.role === UserRole.Client ? (
        <AuthorRequest icon="draw" rightElement={chevron} />
      ) : (
        <ListItem
          icon="draw"
          rightElement={chevron}
          onClick={() => router.push('/admin')}
        >
          寫文
        </ListItem>
      )}

      <ListItem
        icon="annotation"
        rightElement={chevron}
        onClick={() => {
          props.onClose();
          router.push('/reports');
        }}
      >
        問題/建議
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
        icon="info-sign"
        rightElement={chevron}
        onClick={() => {
          props.onClose();
          router.push(`/tnc`);
        }}
      >
        使用條款及免責聲明
      </ListItem>

      <ListItem
        icon={<Github />}
        rightElement={chevron}
        onClick={() => window.open(`https://github.com/Pong420/taisiusyut`)}
      >
        Github
      </ListItem>

      <ListItem
        icon={<Telegram />}
        rightElement={chevron}
        onClick={() => window.open(`https://t.me/taisiusyut`)}
      >
        Telegram
      </ListItem>

      <ListItem
        icon="envelope"
        rightElement={chevron}
        onClick={() => (window.location.href = `mailto:taisiusyut@gmail.com`)}
      >
        taisiusyut@gmail.com
      </ListItem>

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
