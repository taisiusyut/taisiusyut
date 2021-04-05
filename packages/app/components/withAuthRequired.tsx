import React from 'react';
import { PressableProps } from 'react-native';
import {
  openConfirmDialog,
  ConfirmDialogProps
} from '@/components/ConfirmDialog';
import { Logo } from '@/components/Logo';
import {
  createUserForm,
  RegistrationForm,
  LoginForm
} from '@/components/UserForm';
import { useAuth } from '@/hooks/useAuth';

export interface OnPress extends Pick<PressableProps, 'onPress'> {}

const { useForm } = createUserForm();

const dialogProps: Partial<ConfirmDialogProps> = {
  icon: 'user',
  maxWidth: 340
};

export function withAuthRequired<P extends OnPress>(
  Component: React.ComponentType<P>
) {
  return function OpenLoginDialog(props: P) {
    const [form] = useForm();
    const [{ loginStatus }, { authenticate }] = useAuth();

    async function handleConfirm() {
      const payload = await form.validateFields();
      await authenticate(payload).toPromise();
    }

    function handleRegistration() {
      form.resetFields();
      openConfirmDialog({
        ...dialogProps,
        onCancel: handleLogin,
        onConfirm: handleConfirm,
        title: '會員註冊',
        confirmText: '註冊',
        cancelText: '已有帳號',
        children: <RegistrationForm form={form} head={<Logo />} />
      });
    }

    function handleLogin() {
      form.resetFields();
      openConfirmDialog({
        ...dialogProps,
        onCancel: handleRegistration,
        onConfirm: handleConfirm,
        title: '會員登入',
        confirmText: '登入',
        cancelText: '註冊帳號',
        children: <LoginForm form={form} head={<Logo />} />
      });
    }

    return (
      <Component
        {...((props as unknown) as P)}
        onPress={loginStatus === 'loggedIn' ? props.onPress : handleLogin}
      />
    );
  };
}
