import React from 'react';
import { Password } from '@/components/Input';
import { validators } from '@/utils/form';
import { createUserForm, userValidators, UserFormProps } from './UserForm';

const { Form, FormItem } = createUserForm();

export function ModifyPasswordForm(props: UserFormProps) {
  return (
    <Form {...props}>
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
        <Password autoComplete="new-password" />
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
        <Password autoComplete="new-password" />
      </FormItem>
    </Form>
  );
}
