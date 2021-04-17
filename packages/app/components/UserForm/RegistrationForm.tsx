import React from 'react';
import { validators } from '@/utils/form';
import { useFocusNextHandler } from '@/hooks/useFocusNextHandler';
import {
  createUserForm,
  userValidators,
  UserFormProps,
  UserFormSchema
} from './UserForm';

interface Props extends UserFormProps {
  head?: React.ReactNode;
}

const { useForm, Form, Username, Password, Email } = createUserForm();

export function RegistrationForm({ head, children, ...props }: Props) {
  const {
    //
    refProps,
    focusNextProps
  } = useFocusNextHandler<keyof UserFormSchema>();
  const [form] = useForm();

  return (
    <Form {...props} form={form}>
      {head}

      <Username
        inputProps={focusNextProps('password')}
        validators={[
          userValidators.username.required,
          userValidators.username.format
        ]}
      />

      <Password
        deps={['username']}
        inputRef={refProps('password')}
        inputProps={{
          textContentType: 'newPassword',
          ...focusNextProps('confirmNewPassword')
        }}
        validators={({ username }) => [
          userValidators.password.required,
          userValidators.password.format,
          userValidators.password.equalToUsername(username)
        ]}
      />

      <Password
        name="confirmNewPassword"
        label="Confirm Password"
        deps={['password']}
        inputRef={refProps('confirmNewPassword')}
        inputProps={{
          textContentType: 'newPassword',
          ...focusNextProps('email')
        }}
        validators={({ password }) => [
          validators.required('Please input the password again'),
          validators.shouldBeEqual(
            password,
            'Confirm password is not equal to the above password'
          )
        ]}
      />

      <Email
        inputRef={refProps('email')}
        inputProps={{
          returnKeyType: 'send',
          onSubmitEditing: () => form.submit()
        }}
      />

      {children}
    </Form>
  );
}
