import React from 'react';
import router from 'next/router';
import { useRxAsync } from 'use-rx-hooks';
import { Button } from '@blueprintjs/core';
import { createUserForm, RegistrationForm } from '@/components/UserForm';
import { UserRole, Param$CreateUser } from '@/typings';
import { clearJwtToken, createUser, logout } from '@/service';
import { Toaster } from '@/utils/toaster';

const { useForm } = createUserForm();

const registration = async (payload: Param$CreateUser) => {
  await createUser({ ...payload, role: UserRole.Root });
  await logout();
  await router.push('/admin/login');
  clearJwtToken();
};

const onSuccess = async () => {
  Toaster.success({
    message: (
      <>
        <div>root registration success</div>
        <div>please login again</div>
      </>
    )
  });
};

const onFailure = Toaster.apiError.bind(Toaster, 'root registration failure');

export function RootRegisterForm() {
  const [form] = useForm();
  const [{ loading }, { fetch }] = useRxAsync(registration, {
    defer: true,
    onSuccess,
    onFailure
  });

  return (
    <RegistrationForm
      form={form}
      onFinish={({ confirmNewPassword, ...params }) => fetch(params)}
    >
      <Button fill type="submit" intent="primary" loading={loading}>
        Register
      </Button>

      <Button
        fill
        minimal
        disabled={loading}
        onClick={() => form.resetFields()}
      >
        Reset Form
      </Button>
    </RegistrationForm>
  );
}
