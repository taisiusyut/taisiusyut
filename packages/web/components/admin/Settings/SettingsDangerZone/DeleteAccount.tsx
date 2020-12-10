import React from 'react';
import { Param$DeleteAccount } from '@/typings';
import { deleteAccount } from '@/service';
import { Password } from '@/components/Input';
import { DangerButton } from '@/components/DangerButton';
import { openConfirmDialog } from '@/components/ConfirmDialog';
import { createForm, FormProps, validators } from '@/utils/form';
import { Toaster } from '@/utils/toaster';
import { useAuthActions } from '@/hooks/useAuth';

const { Form, FormItem, useForm } = createForm<Param$DeleteAccount>();

function PasswordForm(props: FormProps<Param$DeleteAccount>) {
  return (
    <Form {...props}>
      <FormItem
        name="password"
        label="Confirm Passwrod"
        validators={[validators.required('Please input your password')]}
      >
        <Password autoFocus />
      </FormItem>
    </Form>
  );
}

const title = 'Delete Account';
export function DeleteAccount() {
  const [form] = useForm();
  const { logout } = useAuthActions();

  async function onConfirm() {
    const payload = await form.validateFields();
    try {
      await deleteAccount(payload);
      Toaster.success({ message: 'Delete account success' });
      logout();
    } catch (error) {
      Toaster.apiError('Delete account failure', error);
      throw error;
    }
  }

  return (
    <DangerButton
      text={title}
      onClick={() =>
        openConfirmDialog({
          title,
          icon: 'trash',
          intent: 'danger',
          onConfirm,
          onClosed: () => form.resetFields(),
          children: <PasswordForm form={form} />
        })
      }
    />
  );
}
