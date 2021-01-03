import React, { ComponentProps } from 'react';
import { HTMLSelect } from '@blueprintjs/core';
import { UserStatus } from '@/typings';

const options = Object.values(UserStatus)
  .filter((s): s is UserStatus => typeof s === 'number')
  .map(value => (
    <option key={value} value={value}>
      {UserStatus[value]}
    </option>
  ));

export function UserStatusSelect(props: ComponentProps<typeof HTMLSelect>) {
  return (
    <HTMLSelect fill {...props}>
      <option>Select user status</option>
      {options}
    </HTMLSelect>
  );
}
