import React from 'react';
import { useFocusNext } from '@/hooks/useFocusNext';
import {
  createUserForm,
  userValidators,
  UserFormSchema
} from '@/components/UserForm';
import { AuthScreen } from './AuthScreen';

const { Username, Password, useForm } = createUserForm();

export function Login() {
  const { refProps, focusNextProps } = useFocusNext<keyof UserFormSchema>();
  const [form] = useForm();

  return (
    <AuthScreen form={form} nextScreen="RegistrationScreen">
      <Username
        validators={[userValidators.username.required]}
        inputProps={focusNextProps('password')}
      />
      <Password
        validators={[userValidators.password.required]}
        inputRef={refProps('password')}
        inputProps={{
          returnKeyType: 'send',
          onSubmitEditing: () => form?.submit()
        }}
      />
    </AuthScreen>
  );
}
