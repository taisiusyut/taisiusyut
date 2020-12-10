import React, { MouseEvent } from 'react';
import { openConfirmDialog } from '@/components/ConfirmDialog';
import { createUserForm, ModifyPasswordForm } from '@/components/UserForm';
import { useAuthActions } from '@/hooks/useAuth';
import { modifyPassword } from '@/service';
import { Toaster } from '@/utils/toaster';

export interface OnClick {
  onClick?: (event: MouseEvent<any>) => void;
}

const { useForm } = createUserForm();

const title = '更改密碼';

export function withModifyPassword<P extends OnClick>(
  Component: React.ComponentType<P>
) {
  return function WithModifyPassword(props: P) {
    const [form] = useForm();
    const { logout } = useAuthActions();

    async function onConfirm() {
      const payload = await form.validateFields();
      try {
        await modifyPassword(payload);
        Toaster.success({ message: 'Modify password success' });
        logout();
      } catch (error) {
        Toaster.apiError('Modify password failure', error);
        throw error;
      }
    }

    function handleClick() {
      form.resetFields();
      openConfirmDialog({
        title,
        onConfirm,
        icon: 'lock',
        intent: 'danger',
        confirmText: '確認',
        cancelText: '取消',
        children: <ModifyPasswordForm form={form} />
      });
    }

    return (
      <Component {...props} onClick={handleClick}>
        {title}
      </Component>
    );
  };
}
