import React from 'react';
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

const { Form, Username, Password } = createUserForm();

export function LoginForm({ head, children, ...props }: Props) {
  const {
    //
    refProps,
    focusNextProps
  } = useFocusNextHandler<keyof UserFormSchema>();

  return (
    <Form {...props}>
      {head}
      <Username
        validators={[userValidators.username.required]}
        inputProps={focusNextProps('password')}
      />
      <Password
        validators={[userValidators.password.required]}
        inputRef={refProps('password')}
        inputProps={{
          returnKeyType: 'send',
          onSubmitEditing: () => props.form?.submit()
        }}
      />
      {children}
    </Form>
  );
}
