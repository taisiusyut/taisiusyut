import React from 'react';
import {
  Param$CreateUser,
  Param$UpdateUser,
  Param$UpdateAuthor,
  Param$ModifyPassword
} from '@/typings';
import { createForm, validators, FormProps, FormItemProps } from '@/utils/form';
import { TextInput, TextInputProps } from '@/components/Textinput';
import { PasswordInput } from '@/components/PasswordInput';

type UserFormSchema = Param$CreateUser &
  Partial<Omit<Param$UpdateUser, 'id'>> &
  Partial<Omit<Param$UpdateAuthor, 'id'>> &
  Param$ModifyPassword & {
    tnc: boolean;
  };

export type UserFormProps = FormProps<UserFormSchema>;
export type UserFormInstance = NonNullable<FormProps<UserFormSchema>['form']>;
export type UserFormItemProps = FormItemProps<UserFormSchema>;

export const userValidators = {
  username: validators.username,
  password: validators.password
};

export function createUserForm({ ...itemProps }: UserFormItemProps = {}) {
  const components = createForm<UserFormSchema>(itemProps);
  const { FormItem } = components;

  const Username = ({ label = 'Username', ...props }: UserFormItemProps) => (
    <FormItem {...props} name="username" label={label}>
      <TextInput autoCompleteType="username" textContentType="username" />
    </FormItem>
  );

  const Password = ({
    visible,
    textContentType,
    label = 'Password',
    ...props
  }: UserFormItemProps & {
    visible?: boolean;
    textContentType?: TextInputProps['textContentType'];
  } = {}) => {
    return (
      <FormItem name="password" label={label} {...props}>
        <PasswordInput
          visible={visible}
          autoCompleteType="password"
          textContentType={textContentType}
        />
      </FormItem>
    );
  };

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
      <TextInput
        autoCompleteType="email"
        keyboardType="email-address"
        textContentType="emailAddress"
      />
    </FormItem>
  );

  const Nickname = ({
    label = 'Nickname',
    ...props
  }: UserFormItemProps = {}) => (
    <FormItem {...props} name="nickname" label={label}>
      <TextInput textContentType="nickname" />
    </FormItem>
  );

  return {
    ...components,
    Username,
    Password,
    Email,
    Nickname
  };
}
