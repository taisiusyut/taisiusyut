import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRxAsync } from 'use-rx-hooks';
import { Button } from './Button';
import { Dialog, DialogProps, createDialogHandler, space } from './Dialog';

export interface ConfirmDialogProps extends DialogProps {
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => Promise<unknown>;
  onCancel?: () => void;
}

export const openConfirmDialog = createDialogHandler(ConfirmDialog);

const asyncFn = () => Promise.resolve();

export function ConfirmDialog({
  confirmText = '確認',
  cancelText = '取消',
  onClose,
  onConfirm,
  onCancel,
  children,
  ...props
}: ConfirmDialogProps) {
  const [{ loading }, { fetch }] = useRxAsync(onConfirm || asyncFn, {
    defer: true,
    onSuccess: onClose
  });

  function handleCancel() {
    // the order is important for `withAuthRequired`
    onClose && onClose();
    onCancel && onCancel();
  }

  return (
    <Dialog {...props} onClose={onClose}>
      <View style={styles.dialogContent}>{children}</View>
      <View style={styles.footer}>
        <Button
          intent="primary"
          style={styles.button}
          onPress={fetch}
          loading={loading}
        >
          {confirmText}
        </Button>
        <Button onPress={handleCancel}>{cancelText}</Button>
      </View>
    </Dialog>
  );
}

const styles = StyleSheet.create({
  dialogContent: {
    padding: space
  },
  footer: {
    marginHorizontal: space
  },
  button: {
    marginBottom: 10
  }
});
