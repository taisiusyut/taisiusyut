import React, { ComponentProps } from 'react';
import { HTMLSelect } from '@blueprintjs/core';
import { UserRole } from '@/typings';

const options = Object.values(UserRole).map(value => (
  <option key={value} value={value}>
    {value[0] + value.slice(1).toLowerCase()}
  </option>
));

export function UserRoleSelect(props: ComponentProps<typeof HTMLSelect>) {
  return (
    <HTMLSelect fill {...props}>
      <option>Select user role</option>
      {options}
    </HTMLSelect>
  );
}
