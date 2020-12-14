import React, { ReactNode, SyntheticEvent } from 'react';
import { Button, Dialog, IDialogProps } from '@blueprintjs/core';
import classes from './ListViewDialog.module.scss';

type DivProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

export interface ListViewDialogProps extends IDialogProps {
  children?: ReactNode;
}

export interface ListItemProps extends DivProps {
  rightElement?: ReactNode;
}

export interface ListSpacerProps extends DivProps {}

export interface ListFooterProps extends DivProps {
  onClose?: (event: SyntheticEvent<HTMLElement>) => void;
}

export function ListViewDialog(props: ListViewDialogProps) {
  return <Dialog {...props}>{props.children}</Dialog>;
}

export function ListItem({ rightElement, children, ...props }: ListItemProps) {
  return (
    <div
      {...props}
      className={[classes.item, props.onClick ? classes.interactive : '']
        .join(' ')
        .trim()}
    >
      <div className={classes['item-left']}>{children}</div>
      <div className={classes['item-right']}>{rightElement}</div>
    </div>
  );
}

export function ListSpacer(props: ListSpacerProps) {
  return <div {...props} className={classes.spacer}></div>;
}

export function ListViewDialogFooter({
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
