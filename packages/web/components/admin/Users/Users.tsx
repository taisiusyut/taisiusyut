import React from 'react';
import { Card, H4 } from '@blueprintjs/core';
import {
  createUsePaginationLocal,
  DefaultCRUDActionTypes
} from '@/hooks/usePaginationLocal';
import { createFilter } from '@/components/Filter';
import { UserRoleSelect, UserStatusSelect } from '@/components/Select';
import { Schema$User, Param$GetUsers, Order } from '@/typings';
import { getUsers } from '@/service';
import { Toaster } from '@/utils/toaster';
import { useAuthState } from '@/hooks/useAuth';
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
      payload: Array.from({ length: state.pageSize }, (_, idx) => ({
        id: String(idx)
      }))
    })
});

export function Users() {
  const { state, loading, pagination, actions } = useUserPagination({
    onFailure
  });
  const { sort = { createdAt: Order.DESC } } = state.params;
  const { user } = useAuthState();

  return (
    <div className={classes['users']}>
      <Card>
        <div className={classes['header']}>
          <H4>用戶列表</H4>
          <div className={classes['button-group']}>
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
          <FilterInput name="id" label="用戶ID" />
          <FilterInput name="username" label="用戶名稱" />
          <FilterInput name="email" label="電郵" />
          <FilterInput name="nickname" label="暱稱" />
          <FormItem name="role" label="Role">
            <UserRoleSelect />
          </FormItem>
          <FormItem name="status" label="狀態">
            <UserStatusSelect />
          </FormItem>
          <FilterDateRange name="createdAt" label="創建時間" />
          <FilterDateRange name="updatedAt" label="更新時間" />
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
                role: user?.role,
                title: row.original.username,
                offset: { top: event.pageY, left: event.pageX },
                onClose: () => row.toggleRowSelected(),
                user: row.original as Schema$User,
                onSuccess: payload =>
                  Object.keys(payload).length === 1
                    ? actions.delete(payload)
                    : actions.update(payload)
              });
            }
          }}
        />
      </Card>
    </div>
  );
}
