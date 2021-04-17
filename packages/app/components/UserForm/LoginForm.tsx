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

const { useForm, Form, Username, Password } = createUserForm();

export function LoginForm({ head, children, ...props }: Props) {
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
        validators={[userValidators.username.required]}
        inputProps={focusNextProps('password')}
      />
      <Password
        validators={[userValidators.password.required]}
        inputRef={refProps('password')}
        inputProps={{
          returnKeyType: 'send',
          onSubmitEditing: () => form.submit()
        }}
      />
      {children}
    </Form>
  );
}
