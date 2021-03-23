import React, { ComponentProps, useMemo } from 'react';
import { HTMLSelect } from '@blueprintjs/core';
import { BugReportStatus, UserRole } from '@/typings';

export function BugReportStatusSelect({
  status,
  role,
  ...props
}: ComponentProps<typeof HTMLSelect> & {
  status?: BugReportStatus;
  role?: UserRole;
}) {
  const options = useMemo(() => {
    const isAdmin = role === UserRole.Root || role === UserRole.Admin;
    const allStatus = Object.values(BugReportStatus).filter(
      (s): s is BugReportStatus => typeof s === 'number'
    );
    if (isAdmin) {
      return allStatus;
    }
    if (status === BugReportStatus.Open || status === BugReportStatus.Closed) {
      return [BugReportStatus.Open, BugReportStatus.Closed];
    }
    if (status === BugReportStatus.Fixed) {
      return [
        BugReportStatus.Open,
        BugReportStatus.Fixed,
        BugReportStatus.Closed
      ];
    }
    return [];
  }, [status, role]);

  return (
    <HTMLSelect fill {...props}>
      <option>選擇狀態</option>
      {options.map(value => (
        <option key={value} value={value}>
          {BugReportStatus[value]}
        </option>
      ))}
    </HTMLSelect>
  );
}
