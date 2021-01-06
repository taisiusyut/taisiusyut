import React from 'react';
import {
  Button,
  Dialog,
  IDialogProps,
  Icon,
  IIconProps,
  Drawer,
  IDrawerProps
} from '@blueprintjs/core';
import classes from './MixedOverlay.module.scss';

export interface MixedDialogProps extends Omit<IDialogProps, 'onClose'> {
  onClose: () => void;
  children?: React.ReactNode;
}

export interface MixedDrawerProps extends IDrawerProps {
  onClose: () => void;
  title?: string;
  icon?: IIconProps['icon'];
  children?: React.ReactNode;
  drawerClassName?: string;
}

export type MixedOverlayProps = MixedDialogProps & MixedDrawerProps;

export function MixedDialog({ className = '', ...props }: MixedDialogProps) {
  return (
    <Dialog {...props} className={`${className} ${classes['dialog']}`.trim()} />
  );
}

export function MixedDrawer({
  icon,
  title,
  children,
  className = '',
  ...props
}: MixedDrawerProps) {
  return (
    <Drawer
      size="100%"
      {...props}
      className={`${className} ${classes['drawer']}`.trim()}
    >
      <div
        className={classes['drawer-header']}
        onTouchMove={event => event.preventDefault()}
      >
        <Icon icon={icon} iconSize={20} />
        <span className={classes['heading']}>{title}</span>
        <Button minimal icon="cross" onClick={props.onClose} />
      </div>
      <div className={classes['drawer-content']}>{children}</div>
    </Drawer>
  );
}

export function MixedOverlay(props: MixedOverlayProps) {
  const Component =
    typeof window !== 'undefined' && window.screen.width <= 480
      ? MixedDrawer
      : MixedDialog;
  return <Component {...props} />;
}
