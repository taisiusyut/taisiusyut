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
  Param$ModifyPassword & {
    tnc: boolean;
  };

export type UserFormProps = FormProps<UserFormSchema>;
export type UserFormInstance = NonNullable<FormProps<UserFormSchema>['form']>;
export type UserFormItemProps = FormItemProps<UserFormSchema> & {
  large?: boolean;
};

export const userValidators = {
  username: validators.username,
  password: validators.password
};

export function createUserForm({
  large = false,
  ...itemProps
}: UserFormItemProps = {}) {
  const components = createForm<UserFormSchema>(itemProps);
  const { FormItem } = components;

  const Username = ({ label = 'Username', ...props }: UserFormItemProps) => (
    <FormItem {...props} name="username" label={label}>
      <Input large={large} autoComplete="username" />
    </FormItem>
  );

  const Password = ({
    visible,
    autoComplete,
    label = 'Password',
    ...props
  }: UserFormItemProps & {
    visible?: boolean;
    autoComplete?: InputProps['autoComplete'];
  } = {}) => (
    <FormItem {...props} name="password" label={label}>
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

  const Email = ({ label = 'Email', ...props }: UserFormItemProps = {}) => (
    <FormItem
      {...props}
      name="email"
      label={label}
      validators={[
        validators.required('Please input an email'),
        validators.emailFormat()
      ]}
    >
      <Input large={large} autoComplete="email" type="email" />
    </FormItem>
  );

  const Nickname = ({
    label = 'Nickname',
    ...props
  }: UserFormItemProps = {}) => (
    <FormItem {...props} name="nickname" label={label}>
      <Input large={large} />
    </FormItem>
  );

  const UserRole = ({ label = 'Role', ...props }: UserFormItemProps = {}) => (
    <FormItem {...props} name="role" label={label}>
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
