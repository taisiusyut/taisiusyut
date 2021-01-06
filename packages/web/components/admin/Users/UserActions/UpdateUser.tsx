import React, { useEffect } from 'react';
import { createUserForm } from '@/components/UserForm';
import { updateUser } from '@/service';
import { UserActionDialog, UserActionDialogProps } from './UserActionDialog';

const { Form, Nickname, Email, useForm } = createUserForm();

export function UpdateUserDialog(props: UserActionDialogProps) {
  const [form] = useForm();

  useEffect(() => {
    form.setFieldsValue(props.user);
  }, [form, props.user]);

  return (
    <UserActionDialog
      {...props}
      request={({ id }) =>
        form.validateFields().then(payload => updateUser({ ...payload, id }))
      }
    >
      <Form form={form}>
        <Nickname />
        <Email />
      </Form>
    </UserActionDialog>
  );
}
