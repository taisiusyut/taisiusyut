import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from './Button';
import { Dialog, DialogProps, createDialogHandler, space } from './Dialog';

export interface ConfirmDialogProps extends DialogProps {
  confirmText?: string;
  cancelText?: string;
}

export const openConfirmDialog = createDialogHandler(ConfirmDialog);

export function ConfirmDialog({
  confirmText = '確認',
  cancelText = '取消',
  onClose,
  children,
  ...props
}: ConfirmDialogProps) {
  return (
    <Dialog {...props} onClose={onClose}>
      <View style={styles.dialogContent}>{children}</View>
      <View style={styles.footer}>
        <Button intent="primary" style={styles.button}>
          {confirmText}
        </Button>
        <Button onPress={onClose}>{cancelText}</Button>
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
