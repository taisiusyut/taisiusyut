import React from 'react';
import { ITagProps, Tag } from '@blueprintjs/core';
import { BookStatus } from '@/typings';

interface Props extends ITagProps {
  status?: BookStatus;
}

export function getBookStatusTagProps(status?: BookStatus): ITagProps {
  switch (status) {
    case BookStatus.Public:
      return { children: '連載中', intent: 'success' };
    case BookStatus.Finished:
      return { children: '已完結', intent: 'none', minimal: true };
    case BookStatus.Deleted:
      return { children: '已刪除', intent: 'danger' };
    case BookStatus.Private:
      return { children: '未發佈', intent: 'none', minimal: true };
    default:
      return { minimal: true };
  }
}

export function BookStatusTag({ status }: Props) {
  if (!status) {
    return null;
  }
  return <Tag {...getBookStatusTagProps(status)}></Tag>;
}
