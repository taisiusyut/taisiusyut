import React from 'react';
import router from 'next/router';
import {
  Button,
  Icon,
  IIconProps,
  IOverlayProps,
  Overlay
} from '@blueprintjs/core';
import {
  ClientPreferencesOverlayIcon,
  ClientPreferencesOverlayTitle
} from '@/components/client/ClientPreferencesOverlay';
import { withBreakPoint } from '@/hooks/useBreakPoints';
import classes from './ClientChapterOverlay.module.scss';

interface Props extends IOverlayProps {
  bookName: string;
  goBackButton: React.ReactElement;
  navigateChapter: (factor: 1 | -1) => void;
  openClientPreferences?: () => void;
  openChapterListDrawer?: () => void;
}

type DivProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

interface ItemProps extends DivProps {
  icon?: IIconProps['icon'];
  isActive?: boolean;
}

function Item({ icon, children, isActive, ...props }: ItemProps) {
  return (
    <div
      {...props}
      className={[classes['item'], isActive ? classes['active'] : '']
        .join(' ')
        .trim()}
    >
      <Icon icon={icon} />
      <div className={classes['text']}>{children}</div>
    </div>
  );
}

function ClientChapterOverlayBase({
  bookName,
  goBackButton,
  navigateChapter,
  openClientPreferences,
  openChapterListDrawer,
  ...props
}: Props) {
  return (
    <Overlay {...props} hasBackdrop={false}>
      <div className={classes['content']} onClick={props.onClose}>
        <div className={classes['top']}>{goBackButton}</div>
        <div className={classes['bottom']}>
          <div className={classes['bottom-head']}>
            <Button minimal onClick={() => navigateChapter(-1)}>
              上一章
            </Button>
            <Button minimal onClick={() => navigateChapter(1)}>
              下一章
            </Button>
          </div>
          <div className={classes['bottom-content']}>
            <Item icon="home" onClick={() => router.push(`/`)}>
              書架
            </Item>
            <Item icon="book" onClick={() => router.push(`/book/${bookName}`)}>
              詳情
            </Item>
            <Item
              icon={ClientPreferencesOverlayIcon}
              onClick={openClientPreferences}
            >
              {ClientPreferencesOverlayTitle}
            </Item>
            <Item icon="properties" onClick={openChapterListDrawer}>
              目錄
            </Item>
          </div>
        </div>
      </div>
    </Overlay>
  );
}

export const ClientChapterOverlay = withBreakPoint(ClientChapterOverlayBase, {
  validate: breakPoint => breakPoint <= 768
});
