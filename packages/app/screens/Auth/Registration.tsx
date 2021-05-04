import React from 'react';
import { useFocusNext } from '@/hooks/useFocusNext';
import {
  createUserForm,
  userValidators,
  UserFormSchema
} from '@/components/UserForm';
import { validators } from '@/utils/form';
import { AuthScreen } from './AuthScreen';

const { useForm, Username, Password, Email } = createUserForm();

export function Registration() {
  const { refProps, focusNextProps } = useFocusNext<keyof UserFormSchema>();
  const [form] = useForm();

  return (
    <AuthScreen form={form} nextScreen="LoginScreen">
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
    </AuthScreen>
  );
}
