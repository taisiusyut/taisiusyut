import React from 'react';
import { ConfirmDialogProps, ConfirmDialog } from '@/components/ConfirmDialog';
import { Schema$User } from '@/typings';
import { Toaster } from '@/utils/toaster';

export interface User {
  user: Partial<Schema$User> & Pick<Schema$User, 'id'>;
}

export interface OnSuccess {
  onSuccess: (payload: User['user']) => void;
}

export interface Request {
  request: (params: { id: string }) => Promise<Schema$User | void>;
}

export interface UserActionDialogProps
  extends User,
    OnSuccess,
    ConfirmDialogProps {
  prefix: string;
}

export function UserActionDialog({
  prefix,
  request,
  user,
  onSuccess,
  ...props
}: UserActionDialogProps & Request) {
  async function onConfirm() {
    prefix =
      prefix.slice(0, 1).toUpperCase() +
      prefix.slice(1, prefix.length).toLowerCase();

    try {
      const params = { id: user.id };
      const response = await request(params);
      Toaster.success({ message: `${prefix} user success` });
      onSuccess(response || params);
    } catch (error) {
      Toaster.apiError(`${prefix} user failure`, error);
    }
  }

  return (
    <ConfirmDialog {...props} title={`${prefix} User`} onConfirm={onConfirm} />
  );
}
