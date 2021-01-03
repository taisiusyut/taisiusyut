import React from 'react';
import { createUserForm } from '@/components/UserForm';
import { createUserMenuItem, UserMenuItemProps } from './UserMenuItem';

const { Form, Nickname, Email, useForm } = createUserForm();

const UserMenuItem = createUserMenuItem({
  icon: 'edit',
  text: 'Update',
  title: 'Update User'
});

export function UpdateUserItem(props: Omit<UserMenuItemProps, 'getPayload'>) {
  const [form] = useForm();

  const children = (
    <Form form={form} style={{ width: 400 }} initialValues={props.user}>
      <Nickname />
      <Email />
    </Form>
  );

  return (
    <UserMenuItem {...props} getPayload={() => form.validateFields()}>
      {children}
    </UserMenuItem>
  );
}
