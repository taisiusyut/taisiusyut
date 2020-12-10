import React, { MouseEvent } from 'react';
import { openConfirmDialog } from '@/components/ConfirmDialog';
import { createUserForm, userValidators } from '@/components/UserForm';
import { useAuthActions } from '@/hooks/useAuth';
import { Toaster } from '@/utils/toaster';

interface OnClick<E extends HTMLElement = HTMLElement> {
  onClick?: (event: MouseEvent<E>) => void;
}

const { Form, Username, Password, useForm } = createUserForm();

export function withAuthRequired<P extends OnClick>(
  Component: React.ComponentType<P>
) {
  return function OpenLoginDialog(props: P) {
    const [form] = useForm();
    const { authenticate } = useAuthActions();

    async function onConfirm() {
      try {
        const payload = await form.validateFields();
        await authenticate(payload).toPromise();
      } catch (error) {
        Toaster.apiError(`Login failure`, error);
      }
    }

    function handleClick() {
      openConfirmDialog({
        onConfirm,
        title: '登陸',
        confirmText: 'Login',
        divider: false,
        children: (
          <Form form={form}>
            <Username validators={[userValidators.username.required]} />
            <Password validators={[userValidators.password.required]} />
          </Form>
        )
      });
    }

    return <Component {...((props as unknown) as P)} onClick={handleClick} />;
  };
}
