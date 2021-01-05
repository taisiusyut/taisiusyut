import React from 'react';
import { useRxAsync } from 'use-rx-hooks';
import {
  Button,
  Classes,
  Dialog,
  Intent,
  IDialogProps
} from '@blueprintjs/core';
import { createOpenOverlay } from '@/utils/openOverlay';

export interface ConfirmDialogProps extends IDialogProps {
  children?: React.ReactNode;
  intent?: Intent;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => Promise<unknown>;
  onCancel?: () => unknown | Promise<unknown>;
  onClose?: () => void;
}

const asyncFn = () => Promise.resolve();

export function createConfirmDialog<P extends IDialogProps>(
  Component: React.ComponentType<P>
) {
  return function ConfirmDialog({
    className = '',
    children,
    onClose,
    onConfirm,
    onCancel,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    intent = 'primary',
    ...props
  }: P & ConfirmDialogProps) {
    const [{ loading }, { fetch }] = useRxAsync(onConfirm || asyncFn, {
      defer: true,
      onSuccess: onClose
    });

    async function handleCancel() {
      const cancel = onCancel && onCancel();
      await cancel;
      onClose && onClose();
    }

    return (
      <Component
        {...(props as P)}
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
      </Component>
    );
  };
}

export const ConfirmDialog = createConfirmDialog(Dialog);

export const openConfirmDialog = createOpenOverlay<ConfirmDialogProps>(
  ConfirmDialog
);
