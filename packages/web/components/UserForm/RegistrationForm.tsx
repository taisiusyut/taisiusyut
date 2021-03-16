import React from 'react';
import { Checkbox } from '@blueprintjs/core';
import { createUserForm, userValidators, UserFormProps } from './UserForm';
import { validators } from '@/utils/form';
import classes from './UserForm.module.scss';

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
        valuePropName="checked"
        validateTrigger="onSubmit"
        validators={[validators.required('請閱讀並同意使用條款及私隱政策')]}
      >
        <Checkbox>
          我同意
          <a href="/tnc" target="blank" className={classes['tnc-link']}>
            使用條款及私隱政策
          </a>
        </Checkbox>
      </FormItem>

      {children}
    </Form>
  );
}
