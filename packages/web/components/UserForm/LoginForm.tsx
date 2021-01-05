import React from 'react';
import { createUserForm, userValidators, UserFormProps } from './UserForm';

interface Props extends UserFormProps {
  head?: React.ReactNode;
}

const { Form, Username, Password } = createUserForm();

export function LoginForm({ head, children, ...props }: Props) {
  return (
    <Form {...props}>
      {head}
      <Username validators={[userValidators.username.required]} />
      <Password validators={[userValidators.password.required]} />
      {children}
    </Form>
  );
}
