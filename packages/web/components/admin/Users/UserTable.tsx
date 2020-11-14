import React, { useMemo } from 'react';
import { Button } from '@blueprintjs/core';
import { Schema$User, UserRole } from '@/typings';
import { PaginationTable, PaginationTableProps } from '@/components/Table';
import { SortableHeader } from '@/components/Table/SortableHeader';
import dayjs from 'dayjs';
import { Order } from '@fullstack/server/dist/typings';

type Props = PaginationTableProps<Schema$User>;
type Columns = Props['columns'];

const userColumns: Columns = [
  {
    id: 'index',
    accessor: (_, index) => index + 1,
    Header: () => 'Index'
  },
  {
    id: 'username',
    accessor: 'username',
    Header: 'Username'
  },
  {
    Header: 'Role',
    id: 'role',
    accessor: ({ role }) => {
      if (typeof role !== 'undefined') {
        const str = UserRole[role];
        return str[0] + str.slice(1).toLowerCase();
      }
    }
  },
  {
    id: 'nickname',
    accessor: 'nickname',
    Header: 'Nickname'
  },
  { Header: 'Email', id: 'email', accessor: 'email' },
  {
    id: 'createdAt',
    accessor: ({ createdAt }) =>
      createdAt && dayjs(createdAt).format('YYYY-MM-DD HH:mm:ss'),
    Header: () => (
      <SortableHeader field="createdAt" defaultOrder={Order.DESC}>
        Created At
      </SortableHeader>
    )
  }
];

export function UserTable(props: Omit<Props, 'columns'>) {
  const columns = useMemo(
    () => [
      ...userColumns,
      {
        Header: 'Actions',
        accessor: () => <Button text="Action" />
      }
    ],
    []
  );

  return <PaginationTable {...props} columns={columns} />;
}
