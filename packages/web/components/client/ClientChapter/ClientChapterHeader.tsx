import React from 'react';
import { ButtonPopover } from '@/components/ButtonPopover';
import { ClientHeader, HeaderProps } from '@/components/client/ClientLayout';
import {
  ClientPreferencesOverlayIcon,
  ClientPreferencesOverlayTitle
} from '@/components/client/ClientPreferencesOverlay';
import classes from './ClientChapter.module.scss';

interface Props extends HeaderProps {
  goBackButton: React.ReactElement;
  openClientPreferences?: () => void;
  openChapterListDrawer?: () => void;
}

export function ClientChapterHeader({
  goBackButton,
  openClientPreferences,
  openChapterListDrawer,
  ...props
}: Props) {
  return (
    <ClientHeader
      {...props}
      className={classes['header']}
      left={goBackButton}
      right={[
        <ButtonPopover
          key="0"
          minimal
          icon={ClientPreferencesOverlayIcon}
          content={ClientPreferencesOverlayTitle}
          onClick={openClientPreferences}
        />,
        <ButtonPopover
          key="1"
          minimal
          icon="properties"
          content="章節目錄"
          onClick={openChapterListDrawer}
        />
      ]}
    />
  );
}
