import React from 'react';
import { Schema$User, UserRole, Order } from '@/typings';
import { Table, TableProps, SortableHeader } from '@/components/Table';
import dayjs from 'dayjs';

type Props = TableProps<Schema$User>;
type Columns = Props['columns'];

const userColumns: Columns = [
  {
    id: 'index',
    accessor: (_, index) => index + 1,
    Header: () => <div style={{ textAlign: 'center' }}>Index</div>,
    Cell: ({ value }: { value: number }) => (
      <div style={{ textAlign: 'center' }}>{value}</div>
    )
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
  },
  {
    id: 'updatedAt',
    accessor: ({ updatedAt }) =>
      updatedAt && dayjs(updatedAt).format('YYYY-MM-DD HH:mm:ss'),
    Header: () => (
      <SortableHeader field="updatedAt" defaultOrder={Order.DESC}>
        Updated At
      </SortableHeader>
    )
  }
];

export function UserTable(props: Omit<Props, 'columns'>) {
  return <Table {...props} columns={userColumns} />;
}
