import React from 'react';
import { ITagProps, Tag } from '@blueprintjs/core';
import { UserStatus } from '@/typings';

interface Props extends ITagProps {
  status?: UserStatus;
}

export function getTagPropsByUserStatus(status?: UserStatus): ITagProps {
  switch (status) {
    case UserStatus.Active:
      return { intent: 'success' };
    case UserStatus.InActive:
      return { intent: 'none', minimal: true };
    case UserStatus.Pending:
    case UserStatus.Blocked:
      return { intent: 'warning' };
    case UserStatus.Deleted:
      return { intent: 'danger' };
    default:
      return { minimal: true };
  }
}

export function UserStatusTag({ status }: Props) {
  if (!status) {
    return null;
  }
  return <Tag {...getTagPropsByUserStatus(status)}>{UserStatus[status]}</Tag>;
}
