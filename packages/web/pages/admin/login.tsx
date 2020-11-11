import React, { useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { Button } from '@blueprintjs/core';
import { CardWithLogo } from '@/components/CardWithLogo';
import { createUserForm, userValidators } from '@/components/UserForm';
import { useAuth } from '@/hooks/useAuth';
import router from 'next/router';

interface Props {
  from?: string;
}

const { Form, Username, Password } = createUserForm();

export default function AdminLogin({ from }: Props) {
  const [{ loginStatus }, { authenticate }] = useAuth();

  useEffect(() => {
    if (loginStatus === 'loggedIn') {
      router.push(from || '/admin');
    }
  }, [loginStatus, from]);

  return (
    <div className="container">
      <CardWithLogo title="睇小說">
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
      </CardWithLogo>
      <style jsx>
        {`
          .container {
            @include absolute(0, null, null 0);
            @include sq-dimen(100%);
            @include flex(center, center);
          }
        `}
      </style>
    </div>
  );
}

AdminLogin.isPublic = true;

export const getServerSideProps: GetServerSideProps<Props> = async ({
  query
}) => {
  return {
    props: query
  };
};
