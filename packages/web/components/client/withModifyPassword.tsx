import React, { MouseEvent } from 'react';
import { openMixedConfirmOverlay } from '@/components/MixedOverlay';
import { createUserForm, ModifyPasswordForm } from '@/components/UserForm';
import { modifyPassword } from '@/service';
import { Toaster } from '@/utils/toaster';
import { AuthActions } from '@/hooks/useAuth';

export interface OnClick {
  onClick?: (event: MouseEvent<any>) => void;
}

interface Props {
  logout: AuthActions['logout'];
}

const { useForm } = createUserForm();

const title = '更改密碼';

export function withModifyPassword<P extends OnClick>(
  Component: React.ComponentType<P>
) {
  return function WithModifyPassword({ logout, ...props }: P & Props) {
    const [form] = useForm();

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
      openMixedConfirmOverlay({
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
      <Component {...((props as unknown) as P)} onClick={handleClick}>
        {title}
      </Component>
    );
  };
}
