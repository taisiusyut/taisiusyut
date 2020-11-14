import React from 'react';
import { Button, IconName } from '@blueprintjs/core';
import { Schema$User } from '@/typings';
import { createUser } from '@/service';
import { openConfirmDialog } from '@/components/ConfirmDialog';
import { createUserForm, userValidators } from '@/components/UserForm';
import { Toaster } from '@/utils/toaster';

export interface OnCreate {
  onCreate: (payload: Schema$User) => void;
}

interface CreateUserProps extends OnCreate {}

const {
  Form,
  Username,
  Password,
  Nickname,
  Email,
  UserRole,
  useForm
} = createUserForm();

const icon: IconName = 'new-person';
const title = 'Create User';

export function CreateUser({ onCreate }: CreateUserProps) {
  const [form] = useForm();

  async function onConfirm() {
    const payload = await form.validateFields();
    try {
      const user = await createUser(payload);
      onCreate(user);
      Toaster.success({ message: 'Create user success' });
    } catch (error) {
      Toaster.apiError('Create user failure', error);
      throw error;
    }
  }

  const children = (
    <Form form={form} style={{ width: 400 }}>
      <Username
        validators={[
          userValidators.username.format,
          userValidators.username.required
        ]}
      />
      <Password
        visible
        deps={['username']}
        validators={({ username }) => [
          userValidators.password.required,
          userValidators.password.format,
          userValidators.password.equalToUsername(username)
        ]}
      />
      <Nickname />
      <Email />
      <UserRole />
    </Form>
  );

  function handleClick() {
    openConfirmDialog({
      icon,
      title,
      children,
      onConfirm,
      onClosed: () => form.resetFields()
    });
  }

  return (
    <Button icon={icon} text={title} intent="primary" onClick={handleClick} />
  );
}
