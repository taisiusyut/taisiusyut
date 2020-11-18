import React, {
  ReactNode,
  createContext,
  useState,
  useEffect,
  useContext,
  useMemo
} from 'react';
import { useRxAsync } from 'use-rx-hooks';
import {
  Button,
  Classes,
  Dialog,
  Divider,
  IDialogProps,
  Intent
} from '@blueprintjs/core';
import { useBoolean } from '@/hooks/useBoolean';
import { createOpenOverlay } from '@/utils/openOverlay';

export interface ConfirmDialogProps extends IDialogProps {
  children?: ReactNode;
  intent?: Intent;
  onConfirm?: () => Promise<unknown>;
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

export const ConfirmDialogProvider: React.FC = ({ children }) => {
  const [props, setProps] = useState<Partial<ConfirmDialogProps>>();
  const [isOpen, open, close] = useBoolean();
  const { onClosed } = props || {};
  const value = useMemo<ActionContext>(
    () => ({ openConfirmDialog: setProps }),
    []
  );

  useEffect(() => {
    props && open();
  }, [props, open]);

  return (
    <DialogContext.Provider value={value}>
      {children}
      {props && (
        <ConfirmDialog
          {...props}
          isOpen={isOpen}
          onClose={close}
          onClosed={(...args) => {
            onClosed && onClosed(...args);
            setProps(undefined);
          }}
        />
      )}
    </DialogContext.Provider>
  );
};

export function ConfirmDialog({
  className = '',
  children,
  onClose,
  onConfirm,
  intent = 'primary',
  ...props
}: ConfirmDialogProps) {
  const [{ loading }, { fetch }] = useRxAsync(onConfirm || asyncFn, {
    defer: true,
    onSuccess: onClose
  });

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
        <Divider style={{ marginTop: 20 }} />
      </div>
      <div className={Classes.DIALOG_FOOTER}>
        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button intent={intent} onClick={fetch} loading={loading}>
            Confirm
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
