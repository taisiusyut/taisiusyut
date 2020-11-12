import React from 'react';
import router from 'next/router';
import { useRxAsync } from 'use-rx-hooks';
import { Button } from '@blueprintjs/core';
import { createUserForm, userValidators } from '@/components/UserForm';
import { UserRole, Param$CreateUser } from '@/typings';
import { createUser, logout } from '@/service';
import { Toaster } from '@/utils/toaster';

const {
  Form,
  Username,
  Password,
  ConfirmPassword,
  Email,
  useForm
} = createUserForm();

const registration = async (payload: Param$CreateUser) => {
  await createUser({ ...payload, role: UserRole.Root });
  await logout();
};

const onSuccess = async () => {
  await router.push('/admin/login');
  Toaster.success({
    message: (
      <>
        <div>Root registration success</div>
        <div>Please login again</div>
      </>
    )
  });
};

const onFailure = Toaster.apiError.bind(Toaster, 'root registration failure');

Toaster.success({
  message: <div>Root registration success</div>
});

export function RootRegisterForm() {
  const [form] = useForm();
  const [{ loading }, { fetch }] = useRxAsync(registration, {
    defer: true,
    onSuccess,
    onFailure
  });

  return (
    <Form
      form={form}
      onFinish={({ confirmPassword, ...params }) => fetch(params)}
    >
      <Username
        validators={[
          userValidators.username.required,
          userValidators.username.format
        ]}
      />

      <Password
        deps={['username']}
        validators={({ username }) => [
          userValidators.password.required,
          userValidators.password.format,
          userValidators.password.equalToUsername(username)
        ]}
      />

      <ConfirmPassword />

      <Email />

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
    </Form>
  );
}
