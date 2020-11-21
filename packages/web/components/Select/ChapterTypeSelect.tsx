import React, { ComponentProps } from 'react';
import { HTMLSelect } from '@blueprintjs/core';
import { ChapterType } from '@/typings';

const options = Object.values(ChapterType)
  .filter((c): c is ChapterType => typeof c === 'number')
  .map(value => (
    <option key={value} value={value}>
      {ChapterType[value]}
    </option>
  ));

export function ChapterTypeSelect(props: ComponentProps<typeof HTMLSelect>) {
  return (
    <HTMLSelect fill {...props}>
      <option>Select chapter type</option>
      {options}
    </HTMLSelect>
  );
}
