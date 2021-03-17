import React from 'react';
import { ITagProps, Tag } from '@blueprintjs/core';
import { BugReportStatus } from '@/typings';

interface Props extends ITagProps {
  status?: BugReportStatus;
}

export function getBugReportStatusTagProps(
  status?: BugReportStatus
): ITagProps {
  switch (status) {
    case BugReportStatus.Open:
    case BugReportStatus.ReOpen:
      return { intent: 'success' };
    case BugReportStatus.Closed:
      return { intent: 'danger' };
    case BugReportStatus.Fixed:
      return { intent: 'none', minimal: true };
    case BugReportStatus.Invalid:
      return { intent: 'warning' };
    case BugReportStatus.InProgress:
      return { intent: 'primary' };
    default:
      return { minimal: true };
  }
}

export function BugReportStatusTag({ status }: Props) {
  if (!status) {
    return null;
  }
  return (
    <Tag {...getBugReportStatusTagProps(status)}>{BugReportStatus[status]}</Tag>
  );
}
