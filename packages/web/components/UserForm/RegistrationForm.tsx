import React from 'react';
import { TNCCheckbox } from '@/components/TNC/TNCCheckbox';
import { createUserForm, userValidators, UserFormProps } from './UserForm';
import { validators } from '@/utils/form';

interface Props extends UserFormProps {
  head?: React.ReactNode;
}

const {
  Form,
  Username,
  Password,
  ConfirmPassword,
  Email,
  FormItem
} = createUserForm();

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
        autoComplete="new-password"
        deps={['username']}
        validators={({ username }) => [
          userValidators.password.required,
          userValidators.password.format,
          userValidators.password.equalToUsername(username)
        ]}
      />

      <ConfirmPassword />

      <Email />

      <FormItem
        name="tnc"
        validateTrigger="onSubmit"
        validators={[validators.required('請閱讀並同意使用條款及私隱政策')]}
      >
        <TNCCheckbox />
      </FormItem>

      {children}
    </Form>
  );
}
