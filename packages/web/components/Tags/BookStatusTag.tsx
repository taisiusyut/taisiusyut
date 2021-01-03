import React from 'react';
import { ITagProps, Tag } from '@blueprintjs/core';
import { BookStatus } from '@/typings';

interface Props extends ITagProps {
  status?: BookStatus;
}

export function getTagPropsByBookStatus(status?: BookStatus): ITagProps {
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
  return <Tag {...getTagPropsByBookStatus(status)}>{BookStatus[status]}</Tag>;
}
