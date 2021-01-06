import React from 'react';
import { ConfirmDialogProps, ConfirmDialog } from '@/components/ConfirmDialog';
import { Schema$User } from '@/typings';
import { Toaster } from '@/utils/toaster';

export interface User {
  user: Partial<Schema$User> & Pick<Schema$User, 'id'>;
}

export interface OnUpdate {
  onUpdate: (payload: Schema$User) => void;
}

export interface Request {
  request: (params: { id: string }) => Promise<Schema$User>;
}

export interface UserActionDialogProps
  extends User,
    OnUpdate,
    ConfirmDialogProps {
  prefix: string;
}

export function UserActionDialog({
  prefix,
  request,
  user,
  onUpdate,
  ...props
}: UserActionDialogProps & Request) {
  async function onConfirm() {
    try {
      const response = await request({ id: user.id });
      Toaster.success({ message: `${prefix} user success` });
      onUpdate(response);
    } catch (error) {
      Toaster.apiError(`${prefix} user failure`, error);
    }
  }

  return (
    <ConfirmDialog {...props} title={`${prefix} User`} onConfirm={onConfirm} />
  );
}
