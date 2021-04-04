import React from 'react';
import { Text, View, ViewStyle, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Button } from './Button';
import { Dialog, DialogProps, createDialogHandler, space } from './Dialog';

export interface ConfirmDialogProps extends DialogProps {
  title?: string;
  confirmText?: string;
  cancelText?: string;
  vertialFooter?: boolean;
}

export const openConfirmDialog = createDialogHandler(ConfirmDialog);

export function ConfirmDialog({
  title = '用戶登入',
  confirmText = '確認',
  cancelText = '取消',
  vertialFooter = true,
  onClose,
  children,
  ...props
}: ConfirmDialogProps) {
  const [footerStyle, buttonStyle] = vertialFooter
    ? [styles.vertialFooter, styles.vertialButton]
    : [styles.horzonalFooter, styles.horizonalButton];

  return (
    <Dialog {...props} onClose={onClose}>
      <View style={styles.header}>
        <Feather name="user" size={22} />
        <Text style={styles.titleText}>{title}</Text>
        <Feather name="x" size={26} onPress={onClose} />
      </View>
      <View style={styles.modalContent}>{children}</View>
      <View style={footerStyle}>
        <Button intent="none" style={buttonStyle} onPress={onClose}>
          {cancelText}
        </Button>
        <Button intent="primary" style={buttonStyle}>
          {confirmText}
        </Button>
      </View>
    </Dialog>
  );
}

const footer: ViewStyle = {
  marginTop: space
};

const styles = StyleSheet.create({
  header: {
    paddingVertical: 10,
    paddingHorizontal: space,
    flexDirection: 'row',
    alignItems: 'center'
  },
  titleText: {
    fontSize: 20,
    fontWeight: '500',
    marginLeft: 5,
    flex: 1
  },
  corss: {
    alignSelf: 'flex-end'
  },
  modalContent: {
    paddingVertical: 10,
    paddingHorizontal: space
  },
  horzonalFooter: {
    ...footer,
    flexDirection: 'row',
    paddingHorizontal: space / 2
  },
  horizonalButton: {
    flex: 1,
    marginHorizontal: space / 2
  },
  vertialFooter: {
    ...footer,
    paddingHorizontal: space,
    flexDirection: 'column-reverse'
  },
  vertialButton: {
    marginBottom: 10
  }
});
