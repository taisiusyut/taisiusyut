import React from 'react';
import { TextInput as RNTextInput } from 'react-native';
import {
  Param$CreateUser,
  Param$UpdateUser,
  Param$UpdateAuthor,
  Param$ModifyPassword
} from '@/typings';
import { createForm, validators, FormProps, FormItemProps } from '@/utils/form';
import { TextInput, TextInputProps } from '@/components/Textinput';
import { PasswordInput } from '@/components/PasswordInput';

export type UserFormSchema = Param$CreateUser &
  Partial<Omit<Param$UpdateUser, 'id'>> &
  Partial<Omit<Param$UpdateAuthor, 'id'>> &
  Param$ModifyPassword & {
    tnc: boolean;
  };

export type UserFormProps = FormProps<UserFormSchema>;
export type UserFormInstance = NonNullable<FormProps<UserFormSchema>['form']>;
export type UserFormItemProps = FormItemProps<UserFormSchema> & {
  inputProps?: TextInputProps;
  inputRef?: React.ForwardedRef<RNTextInput>;
};

export const userValidators = {
  username: validators.username,
  password: validators.password
};

export function createUserForm({ ...itemProps }: UserFormItemProps = {}) {
  const components = createForm<UserFormSchema>(itemProps);
  const { FormItem } = components;

  const Username = ({
    label = 'Username',
    inputProps,
    inputRef,
    ...props
  }: UserFormItemProps) => (
    <FormItem {...props} name="username" label={label}>
      <TextInput
        autoCompleteType="username"
        textContentType="username"
        ref={inputRef}
        {...inputProps}
      />
    </FormItem>
  );

  const Password = ({
    visible,
    inputProps,
    inputRef,
    label = 'Password',
    ...props
  }: UserFormItemProps & { visible?: boolean } = {}) => {
    return (
      <FormItem name="password" label={label} {...props}>
        <PasswordInput
          visible={visible}
          autoCompleteType="password"
          ref={inputRef}
          {...inputProps}
        />
      </FormItem>
    );
  };

  const Email = ({
    label = 'Email',
    inputProps,
    inputRef,
    ...props
  }: UserFormItemProps = {}) => (
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
        ref={inputRef}
        {...inputProps}
      />
    </FormItem>
  );

  const Nickname = ({
    label = 'Nickname',
    inputProps,
    inputRef,
    ...props
  }: UserFormItemProps = {}) => (
    <FormItem {...props} name="nickname" label={label}>
      <TextInput textContentType="nickname" ref={inputRef} {...inputProps} />
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
