import React, {
  ReactNode,
  createContext,
  useContext,
  SyntheticEvent
} from 'react';
import { useRxAsync } from 'use-rx-hooks';
import {
  Button,
  Classes,
  Dialog,
  Divider,
  IDialogProps,
  IButtonProps,
  Intent
} from '@blueprintjs/core';
import { createOpenOverlay } from '@/utils/openOverlay';

export enum FooterMode {
  Default,
  Half,
  Fill
}

export interface ConfirmDialogProps extends IDialogProps {
  children?: ReactNode;
  intent?: Intent;
  confirmText?: string;
  cancelText?: string;
  divider?: boolean;
  footerMode?: FooterMode;
  onConfirm?: () => Promise<unknown>;
  onCancel?: () => unknown | Promise<unknown>;
}

interface ActionContext {
  openConfirmDialog: (props: Partial<ConfirmDialogProps>) => void;
}

const asyncFn = () => Promise.resolve();

const DialogContext = createContext<ActionContext | undefined>(undefined);

export function useConfirmDialog() {
  const context = useContext(DialogContext);
  if (context === undefined) {
    throw new Error(
      'useConfirmDialog must be used within a ConfirmDialogProvider'
    );
  }
  return context;
}

export const openConfirmDialog = createOpenOverlay<ConfirmDialogProps>(
  ConfirmDialog
);

export function ConfirmDialog({
  className = '',
  children,
  onClose,
  onConfirm,
  onCancel,
  divider,
  footerMode,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  intent = 'primary',
  ...props
}: ConfirmDialogProps) {
  const [{ loading }, { fetch }] = useRxAsync(onConfirm || asyncFn, {
    defer: true,
    onSuccess: onClose
  });

  const cancelButton = (
    <Button
      onClick={async (event: SyntheticEvent<HTMLElement>) => {
        const cancel = onCancel && onCancel();
        await cancel;
        onClose && onClose(event);
      }}
      disabled={loading}
    >
      {cancelText}
    </Button>
  );

  const confirmButton = (
    <Button intent={intent} onClick={fetch} loading={loading}>
      {confirmText}
    </Button>
  );

  let footer = (
    <div className={Classes.DIALOG_FOOTER_ACTIONS}>
      {cancelButton}
      {confirmButton}
    </div>
  );

  if (footerMode === FooterMode.Half) {
    footer = (
      <div className={Classes.DIALOG_FOOTER_ACTIONS}>
        {React.cloneElement<IButtonProps>(cancelButton, { fill: true })}
        {React.cloneElement<IButtonProps>(confirmButton, { fill: true })}
      </div>
    );
  }

  if (footerMode === FooterMode.Fill) {
    footer = (
      <div>
        {React.cloneElement<IButtonProps>(confirmButton, { fill: true })}
        <div style={{ margin: '10px 0' }}></div>
        {React.cloneElement<IButtonProps>(cancelButton, { fill: true })}
      </div>
    );
  }

  return (
    <Dialog
      {...props}
      onClose={onClose}
      canEscapeKeyClose={!loading}
      canOutsideClickClose={!loading}
      className={className}
    >
      <div className={Classes.DIALOG_BODY}>
        {children}
        {children && divider !== false && <Divider style={{ marginTop: 20 }} />}
      </div>
      <div className={Classes.DIALOG_FOOTER}>{footer}</div>
    </Dialog>
  );
}
