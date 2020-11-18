import React, { ComponentProps } from 'react';
import { HTMLSelect } from '@blueprintjs/core';
import { BookStatus } from '@/typings';

const options = Object.values(BookStatus)
  .filter((c): c is BookStatus => typeof c === 'number')
  .map(value => (
    <option key={value} value={value}>
      {BookStatus[value]}
    </option>
  ));

export function BookStatusSelect(props: ComponentProps<typeof HTMLSelect>) {
  return (
    <HTMLSelect fill {...props}>
      <option>Select book status</option>
      {options}
    </HTMLSelect>
  );
}
