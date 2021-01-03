import React from 'react';
import {
  Param$CreateUser,
  Param$UpdateUser,
  Param$UpdateAuthor,
  Param$ModifyPassword
} from '@/typings';
import { createForm, validators, FormProps, FormItemProps } from '@/utils/form';
import { Input, InputProps, Password as PasswordInput } from '../Input';
import { UserRoleSelect } from '../Select';

type UserFormSchema = Param$CreateUser &
  Partial<Omit<Param$UpdateUser, 'id'>> &
  Partial<Omit<Param$UpdateAuthor, 'id'>> &
  Param$ModifyPassword;

export type UserFormProps = FormProps<UserFormSchema>;
export type UserFormInstance = NonNullable<FormProps<UserFormSchema>['form']>;

export const userValidators = {
  username: validators.username,
  password: validators.password
};

export function createUserForm({
  large = false,
  ...itemProps
}: FormItemProps<UserFormSchema> & { large?: boolean } = {}) {
  const components = createForm<UserFormSchema>(itemProps);
  const { FormItem } = components;

  const Username = (props: FormItemProps<UserFormSchema> = {}) => (
    <FormItem {...(props as unknown)} name="username" label="Username">
      <Input large={large} autoComplete="username" />
    </FormItem>
  );

  const Password = ({
    visible,
    autoComplete,
    ...props
  }: FormItemProps<UserFormSchema> & {
    visible?: boolean;
    autoComplete?: InputProps['autoComplete'];
  } = {}) => (
    <FormItem {...(props as unknown)} name="password" label="Password">
      <PasswordInput
        large={large}
        visible={visible}
        autoComplete={autoComplete}
      />
    </FormItem>
  );

  const ConfirmPassword = () => (
    <FormItem
      name="confirmNewPassword"
      label="Confirm Password"
      deps={['password']}
      validators={({ password }) => [
        validators.required('Please input the password again'),
        validators.shouldBeEqual(
          password,
          'Confirm password is not equal to the above password'
        )
      ]}
    >
      <PasswordInput large={large} autoComplete="new-password" />
    </FormItem>
  );

  const Email = () => (
    <FormItem
      name="email"
      label="Email"
      validators={[
        validators.required('Please input an email'),
        validators.emailFormat()
      ]}
    >
      <Input large={large} autoComplete="email" type="email" />
    </FormItem>
  );

  const Nickname = () => (
    <FormItem name="nickname" label="Nickname">
      <Input large={large} />
    </FormItem>
  );

  const UserRole = () => (
    <FormItem name="role" label="Role">
      <UserRoleSelect large={large} />
    </FormItem>
  );

  return {
    ...components,
    Username,
    Password,
    ConfirmPassword,
    Email,
    Nickname,
    UserRole
  };
}
