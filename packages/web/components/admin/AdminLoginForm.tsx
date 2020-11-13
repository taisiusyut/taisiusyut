import React, { useEffect } from 'react';
import router from 'next/router';
import { defer } from 'rxjs';
import { Button } from '@blueprintjs/core';
import { createUserForm, userValidators } from '@/components/UserForm';
import { useAuth } from '@/hooks/useAuth';

const { Form, Username, Password } = createUserForm();

export function AdminLoginForm() {
  const [{ loginStatus, user }, { authenticate }] = useAuth();

  useEffect(() => {
    if (user) {
      const subscription = defer(() =>
        router.push(
          typeof router.query.from === 'string' ? router.query.from : '/admin'
        )
      ).subscribe();
      return () => subscription.unsubscribe();
    }
  }, [user]);

  return (
    <Form onFinish={authenticate}>
      <Username validators={[userValidators.username.required]} />

      <Password validators={[userValidators.password.required]} />

      <Button
        fill
        type="submit"
        intent="primary"
        loading={loginStatus === 'loading'}
      >
        Login
      </Button>

      <Button
        fill
        minimal
        className="goto-guest-registration"
        // onClick={() => history.push(PATHS.GUEST_REGISTRATION)}
      >
        Register as Guest
      </Button>
    </Form>
  );
}
