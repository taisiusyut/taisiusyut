import React from 'react';
import { MenuItem, IMenuItemProps } from '@blueprintjs/core';
import { Schema$User } from '@/typings';
import { updateUser } from '@/service';
import { openConfirmDialog } from '@/components/ConfirmDialog';
import { createUserForm } from '@/components/UserForm';
import { Toaster } from '@/utils/toaster';

export interface OnUpdate {
  onUpdate: (payload: Schema$User) => void;
}

interface UpdateUserProps extends Partial<IMenuItemProps>, OnUpdate {
  user: Schema$User;
}

const { Form, Nickname, Email, useForm } = createUserForm();

const title = 'Update User';

export function UpdateUser({
  onUpdate,
  user,
  onClick,
  ...props
}: UpdateUserProps) {
  const [form] = useForm();

  async function onConfirm() {
    const payload = await form.validateFields();
    try {
      const updated = await updateUser({ id: user.id, ...payload });
      onUpdate(updated);
      Toaster.success({ message: 'Update user success' });
    } catch (error) {
      Toaster.apiError('Update user failure', error);
      throw error;
    }
  }

  const children = (
    <Form form={form} style={{ width: 400 }} initialValues={user}>
      <Nickname />
      <Email />
    </Form>
  );

  function handleClick(event: React.MouseEvent<HTMLElement, MouseEvent>) {
    openConfirmDialog({
      icon: 'edit',
      title,
      children,
      onConfirm,
      onClosed: () => form.resetFields()
    });
    onClick && onClick(event);
  }

  return (
    <MenuItem {...props} icon="edit" text="Update" onClick={handleClick} />
  );
}
