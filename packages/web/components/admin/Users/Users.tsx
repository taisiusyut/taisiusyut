import React from 'react';
import { Button, Card, H4 } from '@blueprintjs/core';
import {
  createUsePaginationLocal,
  DefaultCRUDActionTypes
} from '@/hooks/usePaginationLocal';
import { createFilter } from '@/components/Filter';
import { UserRoleSelect, UserStatusSelect } from '@/components/Select';
import { Schema$User, Param$GetUsers, Order } from '@/typings';
import { getUsers } from '@/service';
import { Toaster } from '@/utils/toaster';
import { CreateUser } from './CreateUser';
import { UserTable } from './UserTable';
import { openUsersMenu } from './UsersMenu';
import classes from './Users.module.scss';

const {
  FormItem,
  Filter,
  FilterInput,
  FilterDateRange //
} = createFilter<Param$GetUsers>();

const onFailure = Toaster.apiError.bind(Toaster, 'Get users failure');

const useUserPagination = createUsePaginationLocal('id', getUsers, {
  initializer: (state, reducer) =>
    reducer(state, {
      type: DefaultCRUDActionTypes.LIST,
      payload: Array.from({ length: state.pageSize }).map((_, idx) => ({
        id: String(idx)
      }))
    })
});

export function Users() {
  const { state, loading, pagination, actions } = useUserPagination({
    onFailure
  });
  const { sort = { createdAt: Order.DESC } } = state.params;

  return (
    <div className={classes['users']}>
      <Card>
        <div className={classes['header']}>
          <H4>Users</H4>
          <div className={classes['button-group']}>
            <Button>Export</Button>
            <CreateUser
              onCreate={user =>
                actions.insert(
                  user,
                  Number(sort['createdAt']) === Order.ASC
                    ? state.list.length
                    : 0
                )
              }
            />
          </div>
        </div>

        <Filter initialValues={state.params} className={classes['fitler']}>
          <FilterInput name="id" label="User ID" />
          <FilterInput name="username" label="Username" />
          <FilterInput name="email" label="Email" />
          <FilterInput name="nickname" label="Nickname" />
          <FormItem name="role" label="Role">
            <UserRoleSelect />
          </FormItem>
          <FormItem name="status" label="Status">
            <UserStatusSelect />
          </FormItem>
          <FilterDateRange name="createdAt" label="Created At" />
          <FilterDateRange name="updatedAt" label="Updated At" />
        </Filter>

        <UserTable
          data={state.list}
          loading={loading}
          pagination={pagination}
          rowSelectedClassName={classes['row-selected']}
          onRowClick={(row, event) => {
            row.toggleRowSelected();

            if (Object.keys(row.original).length > 0) {
              openUsersMenu({
                title: row.original.username,
                offset: { top: event.pageY, left: event.pageX },
                onClose: () => row.toggleRowSelected(),
                user: row.original as Schema$User,
                onUpdate: actions.update
              });
            }
          }}
        />
      </Card>
    </div>
  );
}
