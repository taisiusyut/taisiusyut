import React from 'react';
import { updateUser } from '@/service';
import { UserStatus } from '@/typings';
import { UserActionDialog, UserActionDialogProps } from './UserActionDialog';
import classes from './UserActions.module.scss';

export function DeleteUserDialog(props: UserActionDialogProps) {
  return (
    <UserActionDialog
      {...props}
      intent="danger"
      request={params => updateUser({ ...params, status: UserStatus.Deleted })}
    >
      <div className={classes['dialog']}>
        Are you sure to delete{' '}
        <span className={classes['highlight']}>{props.user.nickname}</span>{' '}
        account?
      </div>
    </UserActionDialog>
  );
}
