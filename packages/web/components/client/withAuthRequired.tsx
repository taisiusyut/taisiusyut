import React from 'react';
import { Colors, Icon } from '@blueprintjs/core';
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

export interface OnClick {
  onClick?: (event: React.MouseEvent<any>) => void;
}

const { useForm } = createUserForm();

const dialogProps: Partial<ConfirmDialogProps> = {
  icon: 'user'
};

function Warning() {
  return (
    <div
      style={{
        width: 280,
        lineHeight: '1.5em',
        textAlign: 'center',
        marginBottom: 30
      }}
    >
      <Icon icon="warning-sign" intent="warning" iconSize={36} />
      <div>網頁只為示範用途</div>
      <b style={{ color: Colors.RED3 }}>請勿使用真實的帳號 / 密碼 / 電子郵件</b>
    </div>
  );
}

export function withAuthRequired<P extends OnClick>(
  Component: React.ComponentType<P>
) {
  return function OpenLoginDialog(props: P) {
    const [form] = useForm();
    const [{ loginStatus }, { authenticate }] = useAuth();

    async function handleConfirm() {
      const payload = await form.validateFields();
      const auth = await authenticate(payload).toPromise();
      const isLogin = !('email' in payload);

      window.dataLayer.push({
        event: isLogin ? 'login' : 'sign_up',
        method: 'username',
        user_id: auth.user.user_id
      });
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
        children: (
          <RegistrationForm
            form={form}
            head={process.env.NEXT_PUBLIC_GUEST ? <Warning /> : <Logo />}
          />
        )
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
        onClick={loginStatus === 'loggedIn' ? props.onClick : handleLogin}
      />
    );
  };
}
