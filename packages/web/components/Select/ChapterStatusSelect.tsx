import React, { ComponentProps } from 'react';
import { HTMLSelect } from '@blueprintjs/core';
import { ChapterStatus } from '@/typings';

const options = Object.values(ChapterStatus)
  .filter((c): c is ChapterStatus => typeof c === 'number')
  .map(value => (
    <option key={value} value={value}>
      {ChapterStatus[value]}
    </option>
  ));

export function ChapterStatusSelect(props: ComponentProps<typeof HTMLSelect>) {
  return (
    <HTMLSelect fill {...props}>
      <option>Select chapter status</option>
      {options}
    </HTMLSelect>
  );
}
