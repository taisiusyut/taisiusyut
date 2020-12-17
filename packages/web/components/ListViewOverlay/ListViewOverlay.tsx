import React, { ReactNode, SyntheticEvent } from 'react';
import {
  Button,
  Dialog,
  IDialogProps,
  Icon,
  IIconProps,
  Drawer,
  IDrawerProps
} from '@blueprintjs/core';
import { createOpenOverlay } from '@/utils/openOverlay';
import classes from './ListViewOverlay.module.scss';

type DivProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

export interface ListViewDialogProps extends Omit<IDialogProps, 'onClose'> {
  onClose: () => void;
  children?: ReactNode;
}

export interface ListItemProps extends DivProps {
  rightElement?: ReactNode;
  icon?: IIconProps['icon'];
}

export interface ListSpacerProps extends DivProps {}

export interface ListFooterProps extends DivProps {
  onClose?: (event: SyntheticEvent<HTMLElement>) => void;
}

export interface ListViewDrawerProps extends IDrawerProps {
  title?: string;
  icon?: IIconProps['icon'];
  children?: ReactNode;
}

export type ListViewOverlayProps = ListViewDialogProps & ListViewDrawerProps;

export const openListViewDialog = createOpenOverlay(ListViewDialog);

export const openListViewDrawer = createOpenOverlay(ListViewDrawer);

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
      className={[classes.item, props.onClick ? classes.interactive : '']
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
  return <div {...props} className={classes.spacer}></div>;
}

export function ListViewFooter({
  onClose,
  children,
  ...props
}: ListFooterProps) {
  return (
    <div {...props} className={classes.footer}>
      {children}
      {onClose && <Button fill text="關閉" onClick={onClose} />}
    </div>
  );
}

export function ListViewDrawer({
  icon,
  title,
  children,
  ...props
}: ListViewDrawerProps) {
  return (
    <Drawer
      size="100%"
      transitionDuration={300}
      {...props}
      className={classes['drawer']}
    >
      <div className={classes['drawer-header']}>
        <Icon icon={icon} />
        <span className={classes['heading']}>{title}</span>
        <Button minimal icon="cross" onClick={props.onClose} />
      </div>
      <div className={classes['drawer-content']}>{children}</div>
    </Drawer>
  );
}

export function ListViewOverlay(props: ListViewOverlayProps) {
  const Component =
    typeof window !== 'undefined' && window.screen.width <= 480
      ? ListViewDrawer
      : ListViewDialog;
  return <Component {...props} />;
}
