import React from 'react';
import router from 'next/router';
import { useRxAsync } from 'use-rx-hooks';
import { Button } from '@blueprintjs/core';
import { createUserForm, userValidators } from '@/components/UserForm';
import { useAuthActions } from '@/hooks/useAuth';
import { Schema$Authenticated } from '@/typings';

const { Form, Username, Password } = createUserForm();

function onSuccess(auth: Schema$Authenticated) {
  return auth.isDefaultAc
    ? router.push(`/admin/root`)
    : router.push(
        typeof router.query.from === 'string' ? router.query.from : '/admin'
      );
}

export function AdminLoginForm() {
  const { authenticate } = useAuthActions();
  const [{ loading }, { fetch }] = useRxAsync(authenticate, {
    defer: true,
    onSuccess
  });

  return (
    <Form onFinish={fetch}>
      <Username validators={[userValidators.username.required]} />

      <Password validators={[userValidators.password.required]} />

      <Button fill type="submit" intent="primary" loading={loading}>
        Login
      </Button>

      <Button fill minimal onClick={() => router.push('/')}>
        Go Back
      </Button>
    </Form>
  );
}
