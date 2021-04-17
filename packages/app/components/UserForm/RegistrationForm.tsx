import React from 'react';
import { validators } from '@/utils/form';
import { createUserForm, userValidators, UserFormProps } from './UserForm';

interface Props extends UserFormProps {
  head?: React.ReactNode;
}

const { Form, Username, Password, Email } = createUserForm();

export function RegistrationForm({ head, children, ...props }: Props) {
  return (
    <Form {...props}>
      {head}

      <Username
        validators={[
          userValidators.username.required,
          userValidators.username.format
        ]}
      />

      <Password
        deps={['username']}
        textContentType="newPassword"
        validators={({ username }) => [
          userValidators.password.required,
          userValidators.password.format,
          userValidators.password.equalToUsername(username)
        ]}
      />

      <Password
        deps={['password']}
        name="confirmNewPassword"
        label="Confirm Password"
        textContentType="newPassword"
        validators={({ password }) => [
          validators.required('Please input the password again'),
          validators.shouldBeEqual(
            password,
            'Confirm password is not equal to the above password'
          )
        ]}
      />

      <Email />

      {children}
    </Form>
  );
}
