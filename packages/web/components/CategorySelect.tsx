import React, { ComponentProps } from 'react';
import { HTMLSelect } from '@blueprintjs/core';
import { Category } from '@/typings';

const options = Object.values(Category)
  .filter((c): c is Category => typeof c === 'number')
  .map(value => (
    <option key={value} value={value}>
      {Category[value]}
    </option>
  ));

export function CategorySelect(props: ComponentProps<typeof HTMLSelect>) {
  return (
    <HTMLSelect fill {...props}>
      <option>Select category</option>
      {options}
    </HTMLSelect>
  );
}
