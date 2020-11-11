import React from 'react';
import { Schema$User } from '@/typings';
import { RxFileToImageState } from 'use-rx-hooks';
import {
  createForm,
  validators,
  FormProps,
  FormItemProps
} from '../utils/form';
import { Input, Password as PasswordInput } from './Input';
import { UserRoleSelect } from './UserRoleSelect';

interface Schema extends Required<Omit<Schema$User, 'id' | 'avatar'>> {
  confirmPassword: string;
  avatar: RxFileToImageState | string | null;
}

export type UserFormProps = FormProps<Schema>;
export type UserFormInstance = NonNullable<FormProps<Schema>['form']>;

export const userValidators = {
  username: validators.username,
  password: validators.password
};

export function createUserForm({
  large = true,
  ...itemProps
}: FormItemProps<Schema> & { large?: boolean } = {}) {
  const components = createForm<Schema>(itemProps);
  const { Form, FormItem } = components;

  function UserForm(props: UserFormProps) {
    return <Form {...props} />;
  }

  const Username = (props: FormItemProps<Schema> = {}) => (
    <FormItem {...(props as unknown)} name="username" label="Username">
      <Input large={large} />
    </FormItem>
  );

  const Password = (props: FormItemProps<Schema> = {}) => (
    <FormItem {...(props as unknown)} name="password" label="Password">
      <PasswordInput large={large} />
    </FormItem>
  );

  const ConfirmPassword = () => (
    <FormItem
      name="confirmPassword"
      label="Confirm Password"
      deps={['password']}
      validators={({ password }) => [
        validators.required('Please input the  password again'),
        validators.shouldBeEqual(
          password,
          'Confirm password is not equal to the above password'
        )
      ]}
    >
      <PasswordInput large={large} />
    </FormItem>
  );

  const Email = () => (
    <FormItem
      name="email"
      label="Email"
      validators={[
        validators.required('Please input an email')
        // TODO: email validation
      ]}
    >
      <Input large={large} />
    </FormItem>
  );

  const Nickname = () => (
    <FormItem name="nickname" label="Nickname">
      <Input large={large} />
    </FormItem>
  );

  const UserRole = () => (
    <FormItem name="role" label="User role" normalize={Number}>
      <UserRoleSelect large={large} />
    </FormItem>
  );

  return {
    ...components,
    UserForm,
    Username,
    Password,
    ConfirmPassword,
    Email,
    Nickname,
    UserRole
  };
}
