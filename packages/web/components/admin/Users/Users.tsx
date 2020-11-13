import React from 'react';
import { Button, Card, H5 } from '@blueprintjs/core';
import classNames from './Users.module.scss';

export function Users() {
  return (
    <div className={classNames.users}>
      <Card>
        <div className={classNames.header}>
          <H5>Users</H5>
          <div className={classNames['button-group']}>
            <Button>Export</Button>
            <Button intent="primary">Create User</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
