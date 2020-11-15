import React from 'react';
import { Button, Card, H4 } from '@blueprintjs/core';
import { createUsePaginationLocal } from '@/hooks/usePaginationLocal';
import { createFilter } from '@/components/Filter';
import { UserRoleSelect } from '@/components/UserRoleSelect';
import { Schema$User, Param$GetUsers, Order } from '@/typings';
import { getUsers } from '@/service';
import { CreateUser } from './CreateUser';
import { UserTable } from './UserTable';
import classes from './Users.module.scss';
import { openUsersMenu } from './UsersMenu';

const {
  FormItem,
  Filter,
  FilterInput,
  FilterDateRange //
} = createFilter<Param$GetUsers>();

const useUserPagination = createUsePaginationLocal<Schema$User, 'id'>(
  'id',
  getUsers
);

export function Users() {
  const {
    list,
    loading,
    pagination,
    params: { sort = { createdAt: Order.DESC }, ...params },
    actions
  } = useUserPagination();

  return (
    <div className={classes.users}>
      <Card>
        <div className={classes.header}>
          <H4>Users</H4>
          <div className={classes['button-group']}>
            <Button>Export</Button>
            <CreateUser
              onCreate={user =>
                actions.insert(
                  user,
                  Number(sort['createdAt']) === Order.ASC ? list.length : 0
                )
              }
            />
          </div>
        </div>

        <Filter initialValues={params} className={classes.fitler}>
          <FilterInput name="username" label="Username" />
          <FilterInput name="email" label="Email" />
          <FilterInput name="nickname" label="Nickname" />
          <FormItem name="role" label="Role">
            <UserRoleSelect />
          </FormItem>
          <FilterDateRange name="createdAt" label="Created At" />
        </Filter>

        <UserTable
          data={list}
          loading={loading}
          pagination={pagination}
          rowSelectedClassName={classes['row-selected']}
          onRowClick={(row, event) => {
            row.toggleRowSelected();
            openUsersMenu({
              title: row.original.username,
              offset: { top: event.pageY, left: event.pageX },
              onClosed: () => row.toggleRowSelected(),

              user: row.original,
              onUpdate: actions.update,
              onDelete: actions.delete
            });
          }}
        />
      </Card>
    </div>
  );
}
