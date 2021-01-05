import React from 'react';
import {
  Button,
  Dialog,
  IDialogProps,
  Icon,
  IIconProps,
  IDrawerProps
} from '@blueprintjs/core';
import { createOpenOverlay } from '@/utils/openOverlay';
import { MixedOverlay } from '@/components/MixedOverlay';
import classes from './ListViewOverlay.module.scss';

type DivProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

export interface ListViewDialogProps extends Omit<IDialogProps, 'onClose'> {
  onClose: () => void;
  children?: React.ReactNode;
}

export interface ListItemProps extends DivProps {
  rightElement?: React.ReactNode;
  icon?: IIconProps['icon'];
}

export interface ListSpacerProps extends DivProps {}

export interface ListFooterProps extends DivProps {
  onClose?: (event: React.SyntheticEvent<HTMLElement>) => void;
}

export interface ListViewDrawerProps extends IDrawerProps {
  title?: string;
  icon?: IIconProps['icon'];
  children?: React.ReactNode;
}

export type ListViewOverlayProps = ListViewDialogProps & ListViewDrawerProps;

export const openListViewDialog = createOpenOverlay(ListViewDialog);

export const openListViewOverlay = createOpenOverlay(ListViewOverlay);

export function ListViewDialog(props: ListViewDialogProps) {
  return <Dialog {...props}>{props.children}</Dialog>;
}

export function ListItem({
  rightElement,
  children,
  icon,
  ...props
}: ListItemProps) {
  return (
    <div
      {...props}
      className={[classes['item'], props.onClick ? classes['interactive'] : '']
        .join(' ')
        .trim()}
    >
      {icon && <Icon icon={icon} />}
      <div className={classes['item-left']}>{children}</div>
      <div className={classes['item-right']}>{rightElement}</div>
    </div>
  );
}

export function ListSpacer(props: ListSpacerProps) {
  return <div {...props} className={classes['spacer']}></div>;
}

export function ListViewFooter({
  onClose,
  children,
  ...props
}: ListFooterProps) {
  return (
    <div {...props} className={classes['footer']}>
      {children}
      {onClose && <Button fill text="關閉" onClick={onClose} />}
    </div>
  );
}

export function ListViewOverlay(props: ListViewOverlayProps) {
  return <MixedOverlay {...props} className={classes['overlay']} />;
}
