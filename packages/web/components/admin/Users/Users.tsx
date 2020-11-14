import React from 'react';
import { Button, Card, H5 } from '@blueprintjs/core';
import { createUsePaginationLocal } from '@/hooks/usePaginationLocal';
import { createFilter } from '@/components/Filter';
import { UserRoleSelect } from '@/components/UserRoleSelect';
import { Schema$User, Param$GetUsers } from '@/typings';
import { getUsers } from '@/service';
import { CreateUser } from './CreateUser';
import { UserTable } from './UserTable';
import classes from './Users.module.scss';

const { Filter, FilterInput, FormItem } = createFilter<Param$GetUsers>();

const useUserPagination = createUsePaginationLocal<Schema$User, 'id'>(
  'id',
  getUsers
);

export function Users() {
  const { list, loading, pagination, params, actions } = useUserPagination();

  return (
    <div className={classes.users}>
      <Card>
        <div className={classes.header}>
          <H5>Users</H5>
          <div className={classes['button-group']}>
            <Button>Export</Button>
            <CreateUser onCreate={actions.create} />
          </div>
        </div>

        <Filter initialValues={params} className={classes.fitler}>
          <FilterInput name="username" label="Username" />
          <FilterInput name="email" label="Email" />
          <FilterInput name="nickname" label="Nickname" />
          <FormItem name="role" label="Role">
            <UserRoleSelect />
          </FormItem>
        </Filter>

        <UserTable data={list} loading={loading} pagination={pagination} />
      </Card>
    </div>
  );
}
