import React from 'react';
import { ITagProps, Tag } from '@blueprintjs/core';
import { BookStatus } from '@/typings';

interface Props extends ITagProps {
  status?: BookStatus;
}

export function getTagPropsByStatus(status?: BookStatus): ITagProps {
  switch (status) {
    case BookStatus.Public:
      return { intent: 'success' };
    default:
      return { minimal: true };
  }
}

export function BookStatusTag({ status }: Props) {
  if (!status) {
    return null;
  }
  return <Tag {...getTagPropsByStatus(status)}>{BookStatus[status]}</Tag>;
}
