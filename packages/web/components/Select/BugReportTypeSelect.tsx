import React, { ComponentProps } from 'react';
import { HTMLSelect } from '@blueprintjs/core';
import { BugReportType } from '@/typings';

const labels: { [X in keyof typeof BugReportType]: string } = {
  UI: '介面',
  Book: '書籍',
  Chapter: '章節',
  Other: '其他'
};

const options = Object.values(BugReportType)
  .filter((c): c is BugReportType => typeof c === 'number')
  .map(value => (
    <option key={value} value={value}>
      {labels[BugReportType[value] as keyof typeof BugReportType]}
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
