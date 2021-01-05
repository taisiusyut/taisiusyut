import React from 'react';
import {
  MixedConfirmOverlay,
  MixedOverlayProps
} from '@/components/MixedOverlay';
import { createUserForm, ModifyPasswordForm } from '@/components/UserForm';
import { modifyPassword } from '@/service';
import { Toaster } from '@/utils/toaster';
import { createOpenOverlay } from '@/utils/openOverlay';
import { AuthActions } from '@/hooks/useAuth';

interface Props extends MixedOverlayProps {
  logout: AuthActions['logout'];
}

const title = '更改密碼';

const { useForm } = createUserForm();

export const openModifyPasswordOverlay = createOpenOverlay(
  ModifyPasswordOverlay
);

export function ModifyPasswordOverlay({ logout, ...props }: Props) {
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

  return (
    <MixedConfirmOverlay
      {...props}
      icon="lock"
      intent="danger"
      confirmText="確認"
      cancelText="確認"
      title={title}
      onConfirm={onConfirm}
      onClose={() => void 0}
    >
      <ModifyPasswordForm form={form} />
    </MixedConfirmOverlay>
  );
}
