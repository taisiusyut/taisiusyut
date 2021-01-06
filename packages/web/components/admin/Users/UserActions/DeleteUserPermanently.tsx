import React from 'react';
import { deleteUser } from '@/service';
import { UserActionDialog, UserActionDialogProps } from './UserActionDialog';
import classes from './UserActions.module.scss';

export function DeleteUserPermanentlyDialog(props: UserActionDialogProps) {
  return (
    <UserActionDialog {...props} intent="danger" request={deleteUser}>
      <div className={classes['dialog']}>
        This action cannot be undone. This will permanently delete{' '}
        <span className={classes['highlight']}>{props.user.nickname}</span>{' '}
        account.
      </div>
    </UserActionDialog>
  );
}
