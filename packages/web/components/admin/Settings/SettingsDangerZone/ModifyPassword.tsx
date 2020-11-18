import React from 'react';
import { Param$ModifyPassword } from '@/typings';
import { modifyPassword } from '@/service';
import { Password } from '@/components/Input';
import { DangerButton } from '@/components/DangerButton';
import { openConfirmDialog } from '@/components/ConfirmDialog';
import { userValidators } from '@/components/UserForm';
import { createForm, FormProps, validators } from '@/utils/form';
import { Toaster } from '@/utils/toaster';
import { useAuthActions } from '@/hooks/useAuth';

const { Form, FormItem, useForm } = createForm<Param$ModifyPassword>();

function ModifyPasswordForm(props: FormProps<Param$ModifyPassword>) {
  return (
    <Form {...props} style={{ width: 400 }}>
      <FormItem
        name="password"
        label="Old Passwrod"
        validators={[validators.required('Please input your old password')]}
      >
        <Password autoFocus />
      </FormItem>

      <FormItem
        name="newPassword"
        label="New Passwrod"
        deps={['password']}
        validators={({ password }) => {
          return [
            validators.required('Please input new password'),
            userValidators.password.format,
            validators.shouldNotBeEqual(
              password,
              'The new password should not be equal to the old password'
            )
          ];
        }}
      >
        <Password />
      </FormItem>

      <FormItem
        name="confirmNewPassword"
        label="Confirm New Password"
        deps={['newPassword']}
        validators={({ newPassword }) => [
          validators.required('Please input the new password again'),
          validators.shouldBeEqual(
            newPassword,
            'Confirm new password is not equal to the above new password'
          )
        ]}
      >
        <Password />
      </FormItem>
    </Form>
  );
}

const title = 'Modify Password';
export function ModifyPassword() {
  const [form] = useForm();
  const { logout } = useAuthActions();

  async function onConfirm() {
    const payload = await form.validateFields();
    try {
      await modifyPassword(payload);
      Toaster.success({ message: 'Modify account success' });
      logout();
    } catch (error) {
      Toaster.apiError('Modify account failure', error);
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
