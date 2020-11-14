import React from 'react';
import { Button, Card, H5 } from '@blueprintjs/core';
import { createUsePaginationLocal } from '@/hooks/usePaginationLocal';
import { Schema$User } from '@/typings';
import { getUsers } from '@/service';
import { CreateUser } from './CreateUser';
import { UserTable } from './UserTable';
import classNames from './Users.module.scss';

const useUserPagination = createUsePaginationLocal<Schema$User, 'id'>(
  'id',
  getUsers
);

export function Users() {
  const { list, loading, pagination, actions } = useUserPagination();

  return (
    <div className={classNames.users}>
      <Card>
        <div className={classNames.header}>
          <H5>Users</H5>
          <div className={classNames['button-group']}>
            <Button>Export</Button>
            <CreateUser onCreate={actions.create} />
          </div>
        </div>
        <div className={classNames.content}>
          <UserTable
            data={list as any}
            loading={loading}
            pagination={pagination}
          />
        </div>
      </Card>
    </div>
  );
}
