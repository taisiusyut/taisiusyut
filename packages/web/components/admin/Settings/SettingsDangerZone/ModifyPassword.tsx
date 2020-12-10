import React from 'react';
import { modifyPassword } from '@/service';
import { DangerButton } from '@/components/DangerButton';
import { openConfirmDialog } from '@/components/ConfirmDialog';
import { ModifyPasswordForm, createUserForm } from '@/components/UserForm';
import { Toaster } from '@/utils/toaster';
import { useAuthActions } from '@/hooks/useAuth';

const { useForm } = createUserForm();

const title = 'Modify Password';
export function ModifyPassword() {
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

  return (
    <DangerButton
      text={title}
      onClick={() =>
        openConfirmDialog({
          title,
          icon: 'lock',
          intent: 'danger',
          onConfirm,
          onClosed: () => form.resetFields(),
          children: <ModifyPasswordForm form={form} />
        })
      }
    />
  );
}
