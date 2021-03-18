import React, { ComponentProps } from 'react';
import { HTMLSelect } from '@blueprintjs/core';
import { BugReportType } from '@/typings';

export const bugReportTypelabels = {
  [BugReportType.UI]: '介面',
  [BugReportType.Book]: '書籍',
  [BugReportType.Chapter]: '章節',
  [BugReportType.Other]: '其他'
};

const options = Object.values(BugReportType)
  .filter((c): c is BugReportType => typeof c === 'number')
  .map(value => (
    <option key={value} value={value}>
      {bugReportTypelabels[value]}
    </option>
  ));

export function BugReportTypeSelect(props: ComponentProps<typeof HTMLSelect>) {
  return (
    <HTMLSelect fill {...props}>
      <option>選擇類型</option>
      {options}
    </HTMLSelect>
  );
}
