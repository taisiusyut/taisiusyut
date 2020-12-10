import React from 'react';
import {
  createUserForm,
  userValidators,
  UserFormProps
} from '@/components/UserForm';

const { Form, Username, Password, ConfirmPassword, Email } = createUserForm();

export function LoginForm(props: UserFormProps) {
  return (
    <Form>
      {props.children}
      <Username validators={[userValidators.username.required]} />
      <Password validators={[userValidators.password.required]} />
    </Form>
  );
}

export function RegistrationForm(props: UserFormProps) {
  return (
    <Form {...props}>
      {props.children}

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
    </Form>
  );
}
