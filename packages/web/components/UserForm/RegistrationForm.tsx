import React, { ReactNode } from 'react';
import { createUserForm, userValidators, UserFormProps } from './UserForm';

interface Props extends UserFormProps {
  head?: ReactNode;
}

const { Form, Username, Password, ConfirmPassword, Email } = createUserForm();

export function RegistrationForm(props: Props) {
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
