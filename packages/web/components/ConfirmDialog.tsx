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
  IDialogProps,
  Intent
} from '@blueprintjs/core';
import { createOpenOverlay } from '@/utils/openOverlay';

export interface ConfirmDialogProps extends IDialogProps {
  children?: ReactNode;
  intent?: Intent;
  confirmText?: string;
  cancelText?: string;
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
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  intent = 'primary',
  ...props
}: ConfirmDialogProps) {
  const [{ loading }, { fetch }] = useRxAsync(onConfirm || asyncFn, {
    defer: true,
    onSuccess: onClose
  });

  async function handleCancel(event: SyntheticEvent<HTMLElement>) {
    const cancel = onCancel && onCancel();
    await cancel;
    onClose && onClose(event);
  }

  return (
    <Dialog
      {...props}
      onClose={onClose}
      canEscapeKeyClose={!loading}
      canOutsideClickClose={!loading}
      className={className}
    >
      <div className={Classes.DIALOG_BODY}>{children}</div>
      <div className={Classes.DIALOG_FOOTER}>
        <div>
          <Button fill intent={intent} onClick={fetch} loading={loading}>
            {confirmText}
          </Button>
          <div style={{ margin: '10px 0' }}></div>
          <Button fill disabled={loading} onClick={handleCancel}>
            {cancelText}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
